import { useAuth } from '@/auth/hooks/useAuth';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
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
import { Avatar } from 'twenty-ui/display';
import { IconButton } from 'twenty-ui/input';
import { IconPower, IconMoon, IconSun } from 'twenty-ui/display';

const StyledUserProfileHeader = styled.div`
  ${({ theme }) => userProfileHeaderPreset(theme)}
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
  const isMobile = useIsMobile();
  const { colorScheme, setColorScheme } = useColorScheme();
  const systemColorScheme = useSystemColorScheme();

  if (!currentWorkspaceMember) {
    return null;
  }

  const displayName = currentWorkspaceMember.name
    ? `${currentWorkspaceMember.name.firstName} ${currentWorkspaceMember.name.lastName}`.trim()
    : currentWorkspaceMember.userEmail || 'User';

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
      <StyledUserInfo>
        <Avatar
          avatarUrl={currentWorkspaceMember.avatarUrl}
          placeholder={displayName}
          size="xl"
          type="rounded"
        />
        <StyledUserDetails>
          <StyledWelcomeText>{t`Welcome`}</StyledWelcomeText>
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
    </StyledUserProfileHeader>
  );
};
