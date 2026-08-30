import { Platform } from 'react-native';

// Paleta tomada de la tienda pública y del panel administrativo.
export const colors = {
  bg: '#f6f1ea',
  bgApp: '#f9faf4',
  surface: '#ffffff',
  ink: '#1c1917',
  inkSoft: '#5f574d',
  muted: '#9c9587',
  primary: '#E8602A',
  primaryPress: '#cf4e1e',
  salmon: '#F47E6A',
  teal: '#4A5D5E',
  field: '#ece5db',
  line: '#e7e2d5',
  ok: '#3f9b5b',
  danger: '#E8602A',
  white: '#ffffff',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

// El sistema usa una tipografía condensada para titulares y una de interfaz para el resto.
export const fonts = {
  display: Platform.select({ android: 'sans-serif-condensed', default: undefined }),
  body: Platform.select({ android: 'sans-serif', ios: 'System', default: undefined }),
};

export const shadow = {
  card: {
    shadowColor: '#1c1917',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  soft: {
    shadowColor: '#1c1917',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
};
