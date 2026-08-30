import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radii, fonts } from '../theme';

// Campo de texto con etiqueta superior en mayúsculas.
export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  secureTextEntry = false,
  rightSlot,
  multiline = false,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.group}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, focused && styles.fieldFocused, multiline && styles.multiline]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#b3a99c"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {rightSlot}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 7,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: colors.inkSoft,
  },
  field: {
    minHeight: 52,
    borderRadius: radii.md,
    backgroundColor: colors.field,
    borderWidth: 1.5,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  multiline: {
    minHeight: 88,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  fieldFocused: {
    borderColor: 'rgba(232,96,42,0.4)',
  },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
    paddingVertical: 0,
  },
});
