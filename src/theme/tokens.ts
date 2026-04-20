export type ThemeMode = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  border: string;
  divider: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  primary: string;
  primaryStrong: string;
  primarySoft: string;
  onPrimary: string;
  onPrimaryMuted: string;
  success: string;
  warning: string;
  danger: string;
  alert: string;
  zelleBrand: string;
  zelleBrandSoft: string;
  zelleBrandAccent: string;
  editAccent: string;
  editAccentSoft: string;
  editAccentText: string;
};

export type Theme = {
  mode: ThemeMode;
  colors: ThemeColors;
};

// Regions-Bank-ish: off-white surfaces on near-white background,
// dark slate text, canonical lime-green primary (#88bd40 family).
export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: '#f5f5f3',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    surfaceMuted: '#eef0ec',
    border: '#dadfd8',
    divider: '#e1e5df',
    textPrimary: '#1a1f17',
    textSecondary: '#4c5249',
    textMuted: '#7a8076',
    textInverse: '#ffffff',
    primary: '#88bd40',
    primaryStrong: '#6ea52e',
    primarySoft: '#e8f3d5',
    onPrimary: '#ffffff',
    onPrimaryMuted: 'rgba(255,255,255,0.75)',
    success: '#88bd40',
    warning: '#e6a23c',
    danger: '#ff8a5c',
    alert: '#dd2b2b',
    zelleBrand: '#6d1ed4',
    zelleBrandSoft: '#f7f6fb',
    zelleBrandAccent: '#a969ff',
    editAccent: '#6ea52e',
    editAccentSoft: 'rgba(110, 165, 46, 0.14)',
    editAccentText: '#3f6b12',
  },
};

// Subtle navy-tinted dark — never pure black, never a loud blue.
// Neutrals carry a quiet cool cast; cards sit on a slightly navy canvas.
export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: '#121624',
    surface: '#1b1f2e',
    surfaceElevated: '#242939',
    surfaceMuted: '#171b28',
    border: '#2c3142',
    divider: '#272c3b',
    textPrimary: '#f2f3f6',
    textSecondary: '#c2c6d1',
    textMuted: '#878c9a',
    textInverse: '#121624',
    primary: '#88bd40',
    primaryStrong: '#a9dc5f',
    primarySoft: 'rgba(136, 189, 64, 0.14)',
    onPrimary: '#ffffff',
    onPrimaryMuted: 'rgba(255,255,255,0.75)',
    success: '#a9dc5f',
    warning: '#ffbb55',
    danger: '#ff8a5c',
    alert: '#e85555',
    zelleBrand: '#6d1ed4',
    zelleBrandSoft: '#2a1f3a',
    zelleBrandAccent: '#a969ff',
    editAccent: '#a9dc5f',
    editAccentSoft: 'rgba(169, 220, 95, 0.14)',
    editAccentText: '#c8ea8d',
  },
};

export function getTheme(mode: ThemeMode): Theme {
  return mode === 'dark' ? darkTheme : lightTheme;
}
