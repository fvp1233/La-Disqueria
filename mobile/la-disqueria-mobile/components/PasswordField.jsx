import { useState } from 'react';
import { Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import TextField from './TextField';
import { colors } from '../theme';

// Campo de contraseña con botón para mostrar u ocultar el valor.
export default function PasswordField({ label, value, onChangeText, placeholder }) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      autoCapitalize="none"
      secureTextEntry={!visible}
      rightSlot={
        <Pressable onPress={() => setVisible((current) => !current)} hitSlop={10}>
          <Feather name={visible ? 'eye-off' : 'eye'} size={18} color={colors.muted} />
        </Pressable>
      }
    />
  );
}
