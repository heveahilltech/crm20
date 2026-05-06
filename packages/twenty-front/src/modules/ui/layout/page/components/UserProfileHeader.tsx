import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { NavigationDrawerCollapseButton } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerCollapseButton';
import { isNavigationDrawerExpandedState } from '@/ui/navigation/states/isNavigationDrawerExpanded';
import { useColorScheme } from '@/ui/theme/hooks/useColorScheme';
import { useSystemColorScheme } from '@/ui/theme/hooks/useSystemColorScheme';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useContext } from 'react';
import { Avatar, IconMoon, IconSun } from 'twenty-ui/display';
import { IconButton } from 'twenty-ui/input';
import { ThemeContext, themeCssVariables } from 'twenty-ui/theme-constants';

const StyledUserProfileHeader = styled.div<{ isMobile: boolean }>`
  align-items: center;
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  color: ${themeCssVariables.font.color.primary};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${themeCssVariables.spacing['1']};
  margin-left: 0;
  margin-right: ${themeCssVariables.spacing['3']};
  margin-top: ${themeCssVariables.spacing['0.5']};
  padding-bottom: ${themeCssVariables.spacing['2']};
  padding-left: ${({ isMobile }) =>
    isMobile ? themeCssVariables.spacing['3'] : themeCssVariables.spacing['4']};
  padding-right: ${themeCssVariables.spacing['3']};
  padding-top: ${themeCssVariables.spacing['2']};

  &[data-color-scheme='dark'] {
    background: ${themeCssVariables.background.secondary};
  }

  &[data-color-scheme='light'] {
    background: ${themeCssVariables.background.primary};
  }
`;

const StyledLeftSection = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const StyledWelcomeRow = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${themeCssVariables.spacing['2']};
  min-width: 0;
`;

const StyledWelcomeTextColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing['0.5']};
  min-width: 0;
`;

const StyledRightSection = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${themeCssVariables.spacing['2']};
`;

const StyledUserInfo = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${themeCssVariables.spacing['2']};
`;

const StyledUserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing['0.5']};
`;

const StyledWelcomeText = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.regular};
  opacity: 0.8;
`;

const StyledWorkspaceName = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledUserName = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledActions = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${themeCssVariables.spacing['1']};

  & button svg {
    color: ${themeCssVariables.font.color.primary} !important;
    stroke: ${themeCssVariables.font.color.primary} !important;
  }

  &[data-color-scheme='dark'] button:hover {
    background-color: ${themeCssVariables.background.transparent
      .medium} !important;
  }

  &[data-color-scheme='light'] button:hover {
    background-color: ${themeCssVariables.background.transparent
      .light} !important;
  }
`;

const StyledPortalButton = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  display: flex;
  flex-direction: row;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing['1']};
  padding: ${themeCssVariables.spacing['1']} ${themeCssVariables.spacing['2']};
  transition: background-color ${themeCssVariables.animation.duration.fast} ease;

  &[data-color-scheme='dark']:hover {
    background-color: ${themeCssVariables.background.transparent.medium};
  }

  &[data-color-scheme='light']:hover {
    background-color: ${themeCssVariables.background.transparent.light};
  }

  & svg {
    color: ${themeCssVariables.font.color.primary};
    stroke: ${themeCssVariables.font.color.primary};
  }
`;

export const UserProfileHeader = () => {
  const { t } = useLingui();
  const { colorScheme: themeColorScheme } = useContext(ThemeContext);
  const currentWorkspaceMember = useRecoilValue(currentWorkspaceMemberState);
  const currentWorkspace = useRecoilValue(currentWorkspaceState);
  const isMobile = useIsMobile();
  const isNavigationDrawerExpanded = useRecoilValue(
    isNavigationDrawerExpandedState,
  );
  const { colorScheme, setColorScheme } = useColorScheme();
  const systemColorScheme = useSystemColorScheme();

  if (!currentWorkspaceMember) {
    return null;
  }

  const displayName = currentWorkspaceMember.name
    ? `${currentWorkspaceMember.name.firstName} ${currentWorkspaceMember.name.lastName}`.trim()
    : currentWorkspaceMember.userEmail || 'User';

  const workspaceName = currentWorkspace?.displayName || 'Your Workspace';

  const handleReturnToPortal = () => {
    window.location.assign('https://portal.voxring.ai/portal/dashboard');
  };

  // Determine effective theme (if System, use system preference)
  const effectiveTheme =
    colorScheme === 'System' ? systemColorScheme : colorScheme;
  const isDarkMode = effectiveTheme === 'Dark';

  const handleThemeToggle = () => {
    // Toggle between Dark and Light (skip System for toggle)
    const newTheme = isDarkMode ? 'Light' : 'Dark';
    setColorScheme(newTheme);
  };

  return (
    <StyledUserProfileHeader
      isMobile={isMobile}
      data-color-scheme={themeColorScheme}
    >
      <StyledLeftSection>
        <StyledWelcomeRow>
          {!isMobile && !isNavigationDrawerExpanded && (
            <NavigationDrawerCollapseButton direction="right" />
          )}
          <StyledWelcomeTextColumn>
            <StyledWelcomeText>{t`Welcome to`}</StyledWelcomeText>
            <StyledWorkspaceName>{workspaceName}</StyledWorkspaceName>
          </StyledWelcomeTextColumn>
        </StyledWelcomeRow>
      </StyledLeftSection>
      <StyledRightSection>
        <StyledUserInfo>
          <Avatar
            avatarUrl={currentWorkspaceMember.avatarUrl}
            placeholder={displayName}
            size="xl"
            type="rounded"
          />
          <StyledUserDetails>
            <StyledUserName>{displayName}</StyledUserName>
          </StyledUserDetails>
        </StyledUserInfo>
        <StyledActions data-color-scheme={themeColorScheme}>
          {!isMobile && (
            <IconButton
              Icon={isDarkMode ? IconSun : IconMoon}
              size="small"
              variant="secondary"
              accent="default"
              ariaLabel={
                isDarkMode ? t`Switch to light mode` : t`Switch to dark mode`
              }
              onClick={handleThemeToggle}
            />
          )}
          <StyledPortalButton
            data-color-scheme={themeColorScheme}
            type="button"
            onClick={handleReturnToPortal}
          >
            <span>{t`Return to Portal`}</span>
          </StyledPortalButton>
        </StyledActions>
      </StyledRightSection>
    </StyledUserProfileHeader>
  );
};
