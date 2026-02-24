import { ThemeProvider as EmotionThemeProvider, type Theme } from '@emotion/react';
import { useContext, useMemo, type ReactNode } from 'react';
import { ThemeContext, type ThemeType } from 'twenty-ui/theme-constants';

type EmotionThemeBridgeProps = {
  children: ReactNode;
};

/**
 * Resolves Mantine-style spacing args to theme CSS variable strings.
 */
const resolveSpacingToken = (theme: ThemeType, n: number): string => {
  const key =
    n === 0.5 ? '0.5' : n === 1.5 ? '1.5' : String(n);
  const slot = theme.spacing[key as keyof typeof theme.spacing];
  return slot ?? theme.spacing['0'];
};

/**
 * twenty-ui ThemeType stores `spacing` as a token map; Emotion presets use
 * Mantine-style `theme.spacing(2)` / `theme.spacing(3, 0, 0, 8)`.
 * Expose a callable `spacing` and a reliable `name` for light/dark checks.
 */
export const buildEmotionThemeFromTwenty = (
  theme: ThemeType,
  colorScheme: 'light' | 'dark',
): Theme => {
  const spacingFn = (...args: number[]) =>
    args.map((n) => resolveSpacingToken(theme, n)).join(' ');

  return {
    ...theme,
    name: colorScheme,
    spacing: spacingFn,
  } as unknown as Theme;
};

export const EmotionThemeBridge = ({ children }: EmotionThemeBridgeProps) => {
  const { theme, colorScheme } = useContext(ThemeContext);
  const emotionTheme = useMemo(
    () => buildEmotionThemeFromTwenty(theme, colorScheme),
    [theme, colorScheme],
  );

  return (
    <EmotionThemeProvider theme={emotionTheme}>{children}</EmotionThemeProvider>
  );
};
