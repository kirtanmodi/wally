/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0284C7';
const tintColorDark = '#38BDF8';

export const Colors = {
  light: {
    text: '#0F172A',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#64748B',
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorLight,
    card: '#F8FAFC',
    border: '#E2E8F0',
    error: '#EF4444',
    success: '#22C55E',
  },
  dark: {
    text: '#F1F5F9',
    background: '#0F172A',
    tint: tintColorDark,
    icon: '#94A3B8',
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintColorDark,
    card: '#1E293B',
    border: '#334155',
    error: '#EF4444',
    success: '#22C55E',
  },
};
