import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import {
  StyledContainer,
  StyledIconChevronDown,
  StyledLabel,
  StyledLabelWrapper,
  StyledWorkspaceNavLogo,
} from '@/ui/navigation/navigation-drawer/components/MultiWorkspaceDropdown/internal/MultiWorkspacesDropdownStyles';
import { NavigationDrawerAnimatedCollapseWrapper } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerAnimatedCollapseWrapper';
import { DEFAULT_WORKSPACE_LOGO } from '@/ui/navigation/navigation-drawer/constants/DefaultWorkspaceLogo';
import { isNavigationDrawerExpandedState } from '@/ui/navigation/states/isNavigationDrawerExpanded';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { isNonEmptyString } from '@sniptt/guards';
import { useContext } from 'react';
import { Avatar } from 'twenty-ui/display';
import { ThemeContext } from 'twenty-ui/theme-constants';

type MultiWorkspaceDropdownClickableComponentProps = {
  disabled?: boolean;
};

export const MultiWorkspaceDropdownClickableComponent = ({
  disabled,
}: MultiWorkspaceDropdownClickableComponentProps) => {
  const { theme } = useContext(ThemeContext);
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const workspaceLogo = currentWorkspace?.logo;
  const hasWorkspaceLogo = isNonEmptyString(workspaceLogo);

  const isNavigationDrawerExpanded = useAtomStateValue(
    isNavigationDrawerExpandedState,
  );

  return (
    <StyledContainer
      data-testid="workspace-dropdown"
      isNavigationDrawerExpanded={isNavigationDrawerExpanded}
      disabled={disabled}
    >
      {hasWorkspaceLogo ? (
        <>
          <Avatar
            placeholder={currentWorkspace?.displayName || ''}
            avatarUrl={workspaceLogo}
          />
          <StyledLabelWrapper>
            <NavigationDrawerAnimatedCollapseWrapper>
              <StyledLabel>{currentWorkspace?.displayName ?? ''}</StyledLabel>
            </NavigationDrawerAnimatedCollapseWrapper>
          </StyledLabelWrapper>
        </>
      ) : (
        <StyledWorkspaceNavLogo
          src={DEFAULT_WORKSPACE_LOGO}
          alt=""
          draggable={false}
        />
      )}
      <NavigationDrawerAnimatedCollapseWrapper>
        <StyledIconChevronDown
          size={theme.icon.size.md}
          stroke={theme.icon.stroke.sm}
        />
      </NavigationDrawerAnimatedCollapseWrapper>
    </StyledContainer>
  );
};
