import { useCallback, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import StarRating from '../../../components/StarRating';
import TextField from '../../../components/TextField';
import AppButton from '../../../components/AppButton';
import FormBanner from '../../../components/FormBanner';
import { useAuth } from '../../../context/AuthContext';
import {
  getProductReviews,
  getReviewEligibility,
  saveReview,
  deleteReview,
} from '../../../api/reviews';
import { colors, fonts, radii, spacing } from '../../../theme';

const commentMin = 3;
const commentMax = 500;

const ratingLabels = ['', 'Malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente'];

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-SV', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Valoraciones y comentarios de un producto, con formulario para el cliente.
export default function Reviews({ productId, onSummaryChange }) {
  const { user } = useAuth();
  const userId = user?._id || user?.id;

  const [data, setData] = useState({ reviews: [], average: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [canReview, setCanReview] = useState(false);

  const ownReview = data.reviews.find((review) => String(review.customerId) === String(userId));

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const result = await getProductReviews(productId);
      setData(result);
      onSummaryChange?.({ average: result.average, count: result.count });
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  }, [productId, onSummaryChange]);

  useEffect(() => {
    load();
  }, [load]);

  // Solo quien compró el producto puede valorarlo.
  useEffect(() => {
    getReviewEligibility(productId)
      .then((result) => setCanReview(Boolean(result.canReview)))
      .catch(() => setCanReview(false));
  }, [productId]);

  const startEditing = () => {
    setRating(ownReview?.rating || 0);
    setComment(ownReview?.comment || '');
    setErrors({});
    setApiError('');
    setSuccess('');
    setEditing(true);
  };

  const validate = () => {
    const next = {};
    const trimmed = comment.trim();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      next.rating = 'Elige de 1 a 5 estrellas';
    }
    if (!trimmed) next.comment = 'Escribe un comentario';
    else if (trimmed.length < commentMin) next.comment = `Mínimo ${commentMin} caracteres`;
    else if (trimmed.length > commentMax) next.comment = `Máximo ${commentMax} caracteres`;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    setApiError('');
    setSuccess('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await saveReview({ productId, rating, comment: comment.trim() });
      setEditing(false);
      setSuccess('¡Gracias por tu valoración!');
      await load();
    } catch (error) {
      setApiError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!ownReview) return;
    setApiError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await deleteReview(ownReview._id);
      setEditing(false);
      setSuccess('Tu valoración se eliminó');
      await load();
    } catch (error) {
      setApiError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Valoraciones</Text>

      <View style={styles.summary}>
        <Text style={styles.average}>{data.count ? data.average.toFixed(1) : '–'}</Text>
        <View>
          <StarRating value={data.average} size={16} />
          <Text style={styles.summaryText}>
            {data.count} {data.count === 1 ? 'valoración' : 'valoraciones'}
          </Text>
        </View>
      </View>

      <FormBanner message={success} tone="success" />
      {!editing ? <FormBanner message={apiError} /> : null}

      {editing ? (
        <View style={styles.form}>
          <FormBanner message={apiError} />
          <Text style={styles.label}>Tu calificación</Text>
          <View style={styles.pickRow}>
            <StarRating value={rating} onChange={setRating} size={26} />
            {rating ? <Text style={styles.pickLabel}>{ratingLabels[rating]}</Text> : null}
          </View>
          {errors.rating ? <Text style={styles.error}>{errors.rating}</Text> : null}

          <TextField
            label="Comentario"
            value={comment}
            onChangeText={setComment}
            placeholder="¿Qué te pareció este producto?"
            multiline
            maxLength={commentMax}
            error={errors.comment}
          />
          <Text style={styles.counter}>
            {comment.trim().length}/{commentMax}
          </Text>

          <View style={styles.actions}>
            <AppButton
              label="Cancelar"
              variant="ghost"
              onPress={() => setEditing(false)}
              style={styles.action}
            />
            <AppButton
              label="Publicar"
              onPress={handleSubmit}
              loading={submitting}
              style={styles.action}
            />
          </View>
        </View>
      ) : !canReview && !ownReview ? (
        <View style={styles.locked}>
          <Text style={styles.lockedText}>
            Podrás valorar este producto cuando lo hayas comprado.
          </Text>
        </View>
      ) : (
        <View style={styles.actions}>
          {canReview ? (
            <AppButton
              label={ownReview ? 'Editar mi valoración' : 'Escribir valoración'}
              variant="ghost"
              onPress={startEditing}
              style={styles.action}
            />
          ) : null}
          {ownReview ? (
            <AppButton
              label="Eliminar"
              variant="ghost"
              onPress={handleDelete}
              loading={submitting}
              style={styles.deleteAction}
            />
          ) : null}
        </View>
      )}

      {loading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : loadError ? (
        <Pressable onPress={load}>
          <Text style={styles.empty}>{loadError}. Toca para reintentar.</Text>
        </Pressable>
      ) : data.reviews.length === 0 ? (
        <Text style={styles.empty}>Todavía no hay valoraciones. ¡Sé el primero en opinar!</Text>
      ) : (
        data.reviews.map((review) => (
          <View key={review._id} style={styles.review}>
            <View style={styles.reviewHeader}>
              <Text style={styles.author}>
                {review.customerName || 'Cliente'}
                {String(review.customerId) === String(userId) ? ' (tú)' : ''}
              </Text>
              <Text style={styles.date}>{formatDate(review.updatedAt || review.createdAt)}</Text>
            </View>
            <StarRating value={review.rating} size={12} />
            <Text style={styles.comment}>{review.comment}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  heading: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 16,
    textTransform: 'uppercase',
    color: colors.ink,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  average: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 34,
    color: colors.ink,
  },
  summaryText: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 3,
  },
  form: {
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: colors.inkSoft,
  },
  pickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pickLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  error: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.primaryPress,
  },
  counter: {
    alignSelf: 'flex-end',
    fontSize: 11,
    color: colors.muted,
    marginTop: -6,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  action: {
    flex: 1,
    height: 46,
  },
  deleteAction: {
    height: 46,
  },
  locked: {
    backgroundColor: colors.field,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  lockedText: {
    fontSize: 12.5,
    color: colors.inkSoft,
  },
  loader: {
    marginVertical: spacing.lg,
  },
  empty: {
    fontSize: 13,
    color: colors.muted,
    paddingVertical: 8,
  },
  review: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    gap: 5,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  author: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
  },
  date: {
    fontSize: 11.5,
    color: colors.muted,
  },
  comment: {
    fontSize: 13,
    color: colors.inkSoft,
    lineHeight: 19,
  },
});
