import { css, type Theme } from '@emotion/react';
import { type ThemeType } from 'twenty-ui/theme';

import { MOBILE_VIEWPORT } from 'twenty-ui/theme';
import { NAV_DRAWER_WIDTHS } from '@/ui/navigation/navigation-drawer/constants/NavDrawerWidths';
import { PAGE_BAR_MIN_HEIGHT } from '@/ui/layout/page/constants/PageBarMinHeight';

type ExtendedTheme = Theme & ThemeType;

/**
 * Theme utilities for component styling
 *
 * This file provides both:
 * - Utility functions: Individual computed values for specific properties
 * - Style presets: Complete CSS blocks for entire component patterns
 *
 * Use utilities when you need flexibility and individual values.
 * Use presets when you need complete, consistent component styling.
 */

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
// These return individual values (strings or objects) for specific properties

/**
 * Get page body background based on theme
 * Centralizes the logic for choosing between primary and noisy backgrounds
 */
export const getPageBodyBackground = (theme: ExtendedTheme): string => {
  return theme.name === 'dark'
    ? theme.background.primary
    : theme.background.noisy;
};



/**
 * Get inverted text color (white text in dark mode, black text in light mode)
 * Dark mode: returns theme.font.color.primary (gray12 = #fafafa = white)
 * Light mode: returns theme.font.color.primary (gray12 = #111111 = black)
 */
export const getInvertedTextColor = (theme: ExtendedTheme): string => {
  return theme.name === 'dark'
    ? theme.font.color.primary
    : theme.font.color.primary;
};

/**
 * Get user profile header background
 * Light theme: uses theme.background.primary
 * Dark theme: explicitly uses GRAY_SCALE_DARK.gray1
 */
export const getUserProfileHeaderBackground = (theme: ExtendedTheme): string => {
  return theme.name === 'dark'
    ? theme.background.secondary
    : theme.background.primary;
};

/**
 * Get hover background for interactive elements
 */
export const getInteractiveHoverBackground = (theme: ExtendedTheme): string => {
  return theme.name === 'dark'
    ? theme.background.transparent.medium
    : theme.background.transparent.light;
};

/**
 * Get navigation drawer background
 */
export const getNavigationDrawerBackground = (theme: ExtendedTheme): string => {
  return theme.name === 'dark'
    ? theme.background.secondary
    : theme.background.primary;
};

/**
 * Get navigation drawer item active background (blue)
 */
export const getNavigationDrawerItemActiveBackground = (): string => {
  return 'color(display-p3 0 0.267 0.588)'; // Blue accent color
};

/**
 * Get navigation drawer item active text color (white)
 */
export const getNavigationDrawerItemActiveTextColor = (): string => {
  return 'color(display-p3 1 1 1)'; // White
};

/**
 * Get navigation drawer item default text color
 */
export const getNavigationDrawerItemTextColor = (
  theme: ExtendedTheme,
  active?: boolean,
  danger?: boolean,
  soon?: boolean,
): string => {
  if (active) {
    return 'color(display-p3 1 1 1)'; // White for active
  }
  if (danger) {
    return theme.color.red;
  }
  if (soon) {
    return theme.font.color.light;
  }
  return theme.name === 'dark'
    ? theme.font.color.primary
    : theme.grayScale.gray12; // #111111 for light mode
};

/**
 * Get navigation drawer item hover background (blue)
 */
export const getNavigationDrawerItemHoverBackground = (): string => {
  return 'color(display-p3 0 0.267 0.588)'; // Blue accent color
};

/**
 * Get navigation drawer item hover text color (white)
 */
export const getNavigationDrawerItemHoverTextColor = (
  theme: ExtendedTheme,
  danger?: boolean,
): string => {
  return danger ? theme.color.red : 'color(display-p3 1 1 1)'; // White (or red if danger)
};

/**
 * Get page header background (blue accent)
 */
export const getPageHeaderBackground = (): string => {
  return 'color(display-p3 0 0.267 0.588)'; // Blue accent color
};

/**
 * Get page header text color (white)
 */
export const getPageHeaderTextColor = (): string => {
  return 'color(display-p3 0.980 0.980 0.980)'; // #fafafa - White text
};

/**
 * Get page header hover background (semi-transparent white)
 */
export const getPageHeaderHoverBackground = (): string => {
  return 'color(display-p3 0.063 0.078 0.263)'; // Semi-transparent white for hover
};

/**
 * Get page header active background (semi-transparent white, darker)
 */
export const getPageHeaderActiveBackground = (): string => {
  return 'color(display-p3 0.063 0.078 0.263)'; // Semi-transparent white for active state
};

// ============================================================================
// STYLE PRESETS
// ============================================================================
// These return complete CSS blocks (Emotion css template literals)

/**
 * Navigation drawer container preset
 * Standard styling for navigation drawer containers
 */
export const navigationDrawerContainerPreset = (
  theme: ExtendedTheme,
  isSettings?: boolean,
  isMobile?: boolean,
) => css`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: ${getNavigationDrawerBackground(theme)};
  gap: ${theme.spacing(3)};
  height: 100%;
  padding: ${isSettings
    ? isMobile
      ? theme.spacing(3, 0, 0, 8)
      : theme.spacing(3, 0, 4, 0)
    : theme.spacing(3, 0, 4, 2)};

  @media (max-width: ${MOBILE_VIEWPORT}px) {
    width: 100%;
    padding-left: ${theme.spacing(5)};
    padding-right: ${theme.spacing(5)};
  }
`;

/**
 * Navigation drawer item preset
 * Standard styling for navigation drawer items
 */
export const navigationDrawerItemPreset = (
  theme: ExtendedTheme,
  active?: boolean,
  danger?: boolean,
  soon?: boolean,
  isDragging?: boolean,
  isNavigationDrawerExpanded?: boolean,
  hasRightOptions?: boolean,
  indentationLevel?: number,
) => css`
  box-sizing: content-box;
  align-items: center;
  background: ${active
    ? getNavigationDrawerItemActiveBackground()
    : 'transparent'};
  height: ${theme.spacing(5)};
  border: none;
  border-radius: ${theme.border.radius.sm};
  text-decoration: none;
  color: ${getNavigationDrawerItemTextColor(theme, active, danger, soon)};
  cursor: ${soon ? 'default' : 'pointer'};
  display: flex;
  font-family: ${theme.font.family};
  font-size: ${theme.font.size.md};
  padding-bottom: ${theme.spacing(1)};
  padding-left: ${theme.spacing(1)};
  padding-right: ${hasRightOptions ? theme.spacing(0.5) : theme.spacing(1)};
  padding-top: ${theme.spacing(1)};
  margin-top: ${indentationLevel === 2 ? '2px' : '0'};
  pointer-events: ${soon ? 'none' : 'auto'};
  width: ${!isNavigationDrawerExpanded
    ? `calc(${NAV_DRAWER_WIDTHS.menu.desktop.collapsed}px - ${theme.spacing(6)})`
    : `calc(100% - ${theme.spacing(1.5)})`};
  user-select: none;

  ${isDragging &&
  css`
    cursor: grabbing;
  `}

  &:hover {
    background: ${getNavigationDrawerItemHoverBackground()};
    color: ${getNavigationDrawerItemHoverTextColor(theme, danger)};
  }

  &:hover .keyboard-shortcuts {
    visibility: visible;
  }

  @media (max-width: ${MOBILE_VIEWPORT}px) {
    font-size: ${theme.font.size.lg};
  }
`;

/**
 * Default layout preset
 * Standard styling for the main application layout
 */
export const defaultLayoutPreset = (theme: ExtendedTheme) => css`
  background: ${getPageBodyBackground(theme)};
  display: flex;
  flex-direction: column;
  height: 100dvh;
  position: relative;
  scrollbar-color: ${theme.border.color.medium} transparent;
  scrollbar-width: 4px;
  width: 100%;

  *::-webkit-scrollbar-thumb {
    border-radius: ${theme.border.radius.sm};
  }
`;


/**
 * Page body preset - standard styling for page body containers
 */
export const pageBodyPreset = (theme: ExtendedTheme) => css`
  background: ${theme.name === 'dark'
    ? theme.background.primary
    : theme.background.noisy};
  box-sizing: border-box;
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  gap: ${theme.spacing(2)};
  min-height: 0;
  padding-bottom: ${theme.spacing(3)};
  padding-right: ${theme.spacing(3)};
  padding-left: ${theme.spacing(3)};
  width: 100%;

  @media (max-width: ${MOBILE_VIEWPORT}px) {
    padding-left: ${theme.spacing(3)};
    padding-bottom: 0;
  }
`;

/**
 * Page panel preset - standard styling for page panels
 */
export const pagePanelPreset = (theme: ExtendedTheme) => css`
  background: ${theme.name === 'dark'
    ? theme.background.secondary
    : theme.background.primary};
  border: 1px solid ${theme.border.color.medium};
  border-radius: ${theme.border.radius.md};
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

/**
 * Page header preset - standard styling for page headers
 */
export const pageHeaderPreset = (theme: ExtendedTheme) => css`
  gap: ${theme.spacing(2)};
  border: 1px solid ${theme.border.color.medium};
  border-radius: ${theme.border.radius.md};
  font-size: ${theme.font.size.lg};
  padding: ${theme.spacing(3)};
`;





/**
 * Page header button styles preset
 * Reusable button styling for page header buttons (hover, active, pressed states)
 */
export const pageHeaderButtonPreset = () => css`
  button {
    color: ${getPageHeaderTextColor()} !important;

    svg {
      color: ${getPageHeaderTextColor()} !important;
      stroke: ${getPageHeaderTextColor()} !important;
    }

    span {
      color: ${getPageHeaderTextColor()} !important;
    }

    &:hover {
      background-color: ${getPageHeaderHoverBackground()} !important;
      opacity: 1 !important;
      color: ${getPageHeaderTextColor()} !important;

      svg {
        color: ${getPageHeaderTextColor()} !important;
        stroke: ${getPageHeaderTextColor()} !important;
      }

      span {
        color: ${getPageHeaderTextColor()} !important;
      }
    }

    &:active {
      background-color: ${getPageHeaderActiveBackground()} !important;
      color: ${getPageHeaderTextColor()} !important;

      svg {
        color: ${getPageHeaderTextColor()} !important;
        stroke: ${getPageHeaderTextColor()} !important;
      }

      span {
        color: ${getPageHeaderTextColor()} !important;
      }
    }

    &[aria-pressed="true"] {
      color: ${getPageHeaderTextColor()} !important;

      svg {
        color: ${getPageHeaderTextColor()} !important;
        stroke: ${getPageHeaderTextColor()} !important;
      }
    }
  }

  svg {
    color: ${getPageHeaderTextColor()} !important;
    stroke: ${getPageHeaderTextColor()} !important;
  }
`;

/**
 * Page header icon styles preset
 * Reusable icon styling for page header icons
 */
export const pageHeaderIconPreset = () => css`
  color: ${getPageHeaderTextColor()};

  svg {
    color: ${getPageHeaderTextColor()};
    stroke: ${getPageHeaderTextColor()};
  }
`;

/**
 * User profile header preset
 * Standard styling for user profile header container
 */
export const userProfileHeaderPreset = (theme: ExtendedTheme) => css`
  align-items: center;
  background: ${getUserProfileHeaderBackground(theme)};
  border: 1px solid ${theme.border.color.medium};
  border-radius: ${theme.border.radius.md};
  color: ${getInvertedTextColor(theme)};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${theme.spacing(2)} ${theme.spacing(3)};
  margin-left: ${theme.spacing(3)};
  margin-right: ${theme.spacing(3)};
  margin-top: ${theme.spacing(2)};

`;

/**
 * User profile header actions preset
 * Button styling for user profile header actions
 */
export const userProfileHeaderActionsPreset = (theme: ExtendedTheme) => css`
  button {
    svg {
      color: ${getInvertedTextColor(theme)} !important;
      stroke: ${getInvertedTextColor(theme)} !important;
    }

    &:hover {
      background-color: ${getInteractiveHoverBackground(theme)} !important;
    }
  }
`;

/**
 * User profile header logout button preset
 * Styling for the logout button in user profile header
 */
export const userProfileHeaderLogoutButtonPreset = (theme: ExtendedTheme) => css`
  align-items: center;
  background: transparent;
  border: none;
  color: ${getInvertedTextColor(theme)};
  cursor: pointer;
  display: flex;
  flex-direction: row;
  gap: ${theme.spacing(1)};
  padding: ${theme.spacing(1)} ${theme.spacing(2)};
  border-radius: ${theme.border.radius.sm};
  font-size: ${theme.font.size.sm};
  transition: background-color ${theme.animation.duration.fast}s ease;

  &:hover {
    background-color: ${getInteractiveHoverBackground(theme)};
  }

  svg {
    color: ${getInvertedTextColor(theme)};
    stroke: ${getInvertedTextColor(theme)};
  }
`;
/**
 * Page header top bar container preset
 * Standard styling for the page header top bar container
 */
export const pageHeaderTopBarContainerPreset = (theme: ExtendedTheme) => css`
  align-items: center;
  background: ${getPageHeaderBackground()};
  border: 1px solid ${theme.border.color.medium};
  border-radius: ${theme.border.radius.md};
  color: ${getPageHeaderTextColor()};
  display: flex;
  flex-direction: row;
  font-size: ${theme.font.size.lg};
  justify-content: space-between;
  min-height: ${PAGE_BAR_MIN_HEIGHT}px;
  padding: ${theme.spacing(3)};
  margin-left: ${theme.spacing(3)};
  margin-right: ${theme.spacing(3)};
  margin-bottom: ${theme.spacing(2)};
`;

/**
 * Page header title container preset
 * Styling for the page header title container
 */
export const pageHeaderTitleContainerPreset = (theme: ExtendedTheme) => css`
  display: flex;
  font-size: ${theme.font.size.md};
  font-weight: ${theme.font.weight.medium};
  margin-right: ${theme.spacing(1)};
  width: 100%;
  overflow: hidden;
  align-items: center;
  color: ${getPageHeaderTextColor()};
`;

/**
 * Page header left container preset
 * Styling for the left container in page header
 */
export const pageHeaderLeftContainerPreset = (theme: ExtendedTheme) => css`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${theme.spacing(1)};
  overflow-x: hidden;
  width: 100%;

  @media (max-width: ${MOBILE_VIEWPORT}px) {
    padding-left: ${theme.spacing(1)};
  }

  ${pageHeaderButtonPreset()}
`;

/**
 * Page header action container preset
 * Styling for the action container in page header
 */
export const pageHeaderActionContainerPreset = (theme: ExtendedTheme) => css`
  display: inline-flex;
  gap: ${theme.spacing(2)};
  flex: 1 0 auto;

  ${pageHeaderButtonPreset()}

  * {
    color: ${getPageHeaderTextColor()} !important;
  }
`;
