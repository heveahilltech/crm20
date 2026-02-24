import type { SerializedStyles } from '@emotion/react';

/**
 * Emotion `css` presets are composed into Linaria `styled` templates at runtime.
 * Linaria's typings only allow `string | number` for interpolations; this bridges the gap.
 */
export const asLinariaInterpolation = (
  styles: SerializedStyles,
): string => styles as unknown as string;
