import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { type ReactNode } from 'react';
import { useRecoilValue } from 'recoil';
import { NavigationDrawerCollapseButton } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerCollapseButton';
import { PAGE_ACTION_CONTAINER_CLICK_OUTSIDE_ID } from '@/ui/layout/page/constants/PageActionContainerClickOutsideId';
import { PAGE_BAR_MIN_HEIGHT } from '@/ui/layout/page/constants/PageBarMinHeight';
import { isNavigationDrawerExpandedState } from '@/ui/navigation/states/isNavigationDrawerExpanded';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { AnimatePresence } from 'framer-motion';
import {
  pageHeaderActionContainerPreset,
  pageHeaderIconPreset,
  pageHeaderLeftContainerPreset,
  pageHeaderTitleContainerPreset,
  pageHeaderTopBarContainerPreset,
} from '@/ui/theme/utils/themeUtils';
import {
  type IconComponent,
  IconX,
  OverflowingTextWithTooltip,
} from 'twenty-ui/display';
import { LightIconButton } from 'twenty-ui/input';
import { MOBILE_VIEWPORT } from 'twenty-ui/theme';
import { UserProfileHeader } from './UserProfileHeader';

const StyledPageHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledTopBarContainer = styled.div<{ isMobile: boolean }>`
  ${({ theme }) => pageHeaderTopBarContainerPreset(theme)}
`;

const StyledLeftContainer = styled.div`
  ${({ theme }) => pageHeaderLeftContainerPreset(theme)}
`;

const StyledTitleContainer = styled.div`
  ${({ theme }) => pageHeaderTitleContainerPreset(theme)}
`;

const StyledTopBarIconStyledTitleContainer = styled.div`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  flex-direction: row;
  width: 100%;
  overflow: hidden;
  ${pageHeaderIconPreset()}
`;

const StyledPageActionContainer = styled.div`
  ${({ theme }) => pageHeaderActionContainerPreset(theme)}
`;

const StyledIconContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  ${pageHeaderIconPreset()}
`;

type PageHeaderProps = {
  title?: ReactNode;
  hasClosePageButton?: boolean;
  onClosePage?: () => void;
  Icon?: IconComponent;
  children?: ReactNode;
  className?: string;
};

export const PageHeader = ({
  title,
  hasClosePageButton,
  onClosePage,
  Icon,
  children,
  className,
}: PageHeaderProps) => {
  const isMobile = useIsMobile();
  const theme = useTheme();
  const isNavigationDrawerExpanded = useRecoilValue(
    isNavigationDrawerExpandedState,
  );

  return (
    <AnimatePresence initial={false}>
      <StyledPageHeaderWrapper>
        <UserProfileHeader />
        <StyledTopBarContainer className={className} isMobile={isMobile}>
          <StyledLeftContainer>
            {!isMobile && !isNavigationDrawerExpanded && (
              <NavigationDrawerCollapseButton direction="right" />
            )}
            {hasClosePageButton && (
              <LightIconButton
                Icon={IconX}
                size="small"
                accent="tertiary"
                onClick={() => onClosePage?.()}
              />
            )}

            <StyledTopBarIconStyledTitleContainer>
              {Icon && (
                <StyledIconContainer>
                  <Icon size={theme.icon.size.md} />
                </StyledIconContainer>
              )}
              {title && (
                <StyledTitleContainer data-testid="top-bar-title">
                  {typeof title === 'string' ? (
                    <OverflowingTextWithTooltip text={title} />
                  ) : (
                    title
                  )}
                </StyledTitleContainer>
              )}
            </StyledTopBarIconStyledTitleContainer>
          </StyledLeftContainer>

          <StyledPageActionContainer
            data-click-outside-id={PAGE_ACTION_CONTAINER_CLICK_OUTSIDE_ID}
          >
            {children}
          </StyledPageActionContainer>
        </StyledTopBarContainer>
      </StyledPageHeaderWrapper>
    </AnimatePresence>
  );
};
