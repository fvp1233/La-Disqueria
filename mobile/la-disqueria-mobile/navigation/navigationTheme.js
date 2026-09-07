import { DefaultTheme } from '@react-navigation/native';
import { colors } from '../theme';

// Tema de navegación alineado con la paleta de la tienda.
export const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.bgApp,
    card: colors.surface,
    text: colors.ink,
    border: colors.line,
    notification: colors.primary,
  },
};
