import { useAuth } from '@/auth/hooks/useAuth';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { NavigationDrawerCollapseButton } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerCollapseButton';
import { isNavigationDrawerExpandedState } from '@/ui/navigation/states/isNavigationDrawerExpanded';
import { useColorScheme } from '@/ui/theme/hooks/useColorScheme';
import { useSystemColorScheme } from '@/ui/theme/hooks/useSystemColorScheme';
import {
  getInvertedTextColor,
  userProfileHeaderActionsPreset,
  userProfileHeaderLogoutButtonPreset,
  userProfileHeaderPreset,
} from '@/ui/theme/utils/themeUtils';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import styled from '@emotion/styled';
import { useLingui } from '@lingui/react/macro';
import { useRecoilValue } from 'recoil';
import { Avatar, IconPower, IconMoon, IconSun } from 'twenty-ui/display';
import { IconButton } from 'twenty-ui/input';

const StyledUserProfileHeader = styled.div`
  ${({ theme }) => userProfileHeaderPreset(theme)}
`;

const StyledLeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(0.5)};
  align-items: flex-start;
`;

const StyledRightSection = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledUserInfo = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledUserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(0.5)};
`;

const StyledWelcomeText = styled.div`
  color: ${({ theme }) => getInvertedTextColor(theme)};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.regular};
  opacity: 0.8;
`;

const StyledWorkspaceName = styled.div`
  color: ${({ theme }) => getInvertedTextColor(theme)};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

const StyledUserName = styled.div`
  color: ${({ theme }) => getInvertedTextColor(theme)};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

const StyledActions = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(1)};
  
  ${({ theme }) => userProfileHeaderActionsPreset(theme)}
`;

const StyledLogoutButton = styled.button`
  ${({ theme }) => userProfileHeaderLogoutButtonPreset(theme)}
`;

export const UserProfileHeader = () => {
  const { t } = useLingui();
  const { signOut } = useAuth();
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

  const handleLogout = async () => {
    await signOut();
  };

  // Determine effective theme (if System, use system preference)
  const effectiveTheme = colorScheme === 'System' ? systemColorScheme : colorScheme;
  const isDarkMode = effectiveTheme === 'Dark';

  const handleThemeToggle = () => {
    // Toggle between Dark and Light (skip System for toggle)
    const newTheme = isDarkMode ? 'Light' : 'Dark';
    setColorScheme(newTheme);
  };

  return (
    <StyledUserProfileHeader>
      <StyledLeftSection>
        {!isMobile && !isNavigationDrawerExpanded && (
          <NavigationDrawerCollapseButton direction="right" />
        )}
        <StyledWelcomeText>{t`Welcome to`}</StyledWelcomeText>
        <StyledWorkspaceName>{workspaceName}</StyledWorkspaceName>
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
        <StyledActions>
          {!isMobile && (
            <IconButton
              Icon={isDarkMode ? IconSun : IconMoon}
              size="small"
              variant="secondary"
              accent="default"
              ariaLabel={isDarkMode ? t`Switch to light mode` : t`Switch to dark mode`}
              onClick={handleThemeToggle}
            />
          )}
          <StyledLogoutButton onClick={handleLogout}>
            <IconPower size={16} />
            <span>{t`Log out`}</span>
          </StyledLogoutButton>
        </StyledActions>
      </StyledRightSection>
    </StyledUserProfileHeader>
  );
};

