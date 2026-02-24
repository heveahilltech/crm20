import { NavigationDrawerAnimatedCollapseWrapper } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerAnimatedCollapseWrapper';
import {
  StyledContainer,
  StyledIconChevronDown,
} from '@/ui/navigation/navigation-drawer/components/MultiWorkspaceDropdown/internal/MultiWorkspacesDropdownStyles';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useRecoilValue } from 'recoil';
import { useTheme } from '@emotion/react';
import { isNavigationDrawerExpandedState } from '@/ui/navigation/states/isNavigationDrawerExpanded';
import styled from '@emotion/styled';

const StyledLogo = styled.img`
  height: 30px;
  width: auto;
  object-fit: contain;
  display: block;
`;

export const MultiWorkspaceDropdownClickableComponent = () => {
  const currentWorkspace = useRecoilValue(currentWorkspaceState);
  const theme = useTheme();

  const isNavigationDrawerExpanded = useRecoilValue(
    isNavigationDrawerExpandedState,
  );
  return (
    <StyledContainer
      data-testid="workspace-dropdown"
      isNavigationDrawerExpanded={isNavigationDrawerExpanded}
    >
      <StyledLogo src="/images/integrations/VoxRing.png" alt="VoxRing Logo" />

      <NavigationDrawerAnimatedCollapseWrapper>
        <StyledIconChevronDown
          size={theme.icon.size.md}
          stroke={theme.icon.stroke.sm}
        />
      </NavigationDrawerAnimatedCollapseWrapper>
    </StyledContainer>
  );
};
