import type { ThemeType } from 'twenty-ui/theme-constants';

/**
 * Emotion receives the twenty theme from EmotionThemeBridge; `spacing` is a
 * Mantine-style helper at runtime (see buildEmotionThemeFromTwenty).
 */
type EmotionAppTheme = Omit<ThemeType, 'spacing' | 'name'> & {
  name: 'light' | 'dark' | string;
  spacing: (...args: number[]) => string;
};

declare module '@emotion/react' {
  export interface Theme extends EmotionAppTheme {}
}
