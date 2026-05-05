import { styled } from '@linaria/react';
import { type ReactNode, useContext } from 'react';

import { PAGE_ACTION_CONTAINER_CLICK_OUTSIDE_ID } from '@/ui/layout/page/constants/PageActionContainerClickOutsideId';
import { PAGE_BAR_MIN_HEIGHT } from '@/ui/layout/page/constants/PageBarMinHeight';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { AnimatePresence } from 'framer-motion';
import { isDefined } from 'twenty-shared/utils';
import {
  type IconComponent,
  IconX,
  OverflowingTextWithTooltip,
} from 'twenty-ui/display';
import { LightIconButton } from 'twenty-ui/input';
import {
  MOBILE_VIEWPORT,
  ThemeContext,
  themeCssVariables,
} from 'twenty-ui/theme-constants';

const PAGE_HEADER_LIGHT_BACKGROUND = '#004496';
const PAGE_HEADER_DARK_BACKGROUND = '#292f46';
const PAGE_HEADER_FOREGROUND = '#ffffff';

const StyledTopBarContainer = styled.div<{ isMobile: boolean }>`
  align-items: center;
  background: ${PAGE_HEADER_LIGHT_BACKGROUND};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  color: ${PAGE_HEADER_FOREGROUND};
  display: flex;
  flex-direction: row;
  font-size: ${themeCssVariables.font.size.lg};
  gap: ${themeCssVariables.spacing[2]};
  justify-content: space-between;
  min-height: ${PAGE_BAR_MIN_HEIGHT}px;
  margin-bottom: ${themeCssVariables.spacing['1']};
  margin-left: 0;
  margin-right: ${themeCssVariables.spacing['3']};
  margin-top: ${themeCssVariables.spacing['2']};
  padding-bottom: ${themeCssVariables.spacing[3]};
  padding-left: ${({ isMobile }) =>
    isMobile ? themeCssVariables.spacing[3] : themeCssVariables.spacing[4]};
  padding-right: ${themeCssVariables.spacing[3]};
  padding-top: ${themeCssVariables.spacing[3]};
  
  &[data-color-scheme='light'] {
    background: ${PAGE_HEADER_LIGHT_BACKGROUND};
  }

  &[data-color-scheme='dark'] {
    background: ${PAGE_HEADER_DARK_BACKGROUND};
  }

  & button {
    color: ${PAGE_HEADER_FOREGROUND} !important;
  }

  & button svg {
    color: ${PAGE_HEADER_FOREGROUND} !important;
    stroke: ${PAGE_HEADER_FOREGROUND} !important;
  }

  &[data-color-scheme='light'] button:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.12);
  }

  &[data-color-scheme='dark'] button:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.14);
  }
`;

const StyledLeftContainer = styled.div`
  align-items: center;
  display: flex;
  flex: 0 1 auto;
  flex-direction: row;
  gap: ${themeCssVariables.spacing[1]};
  min-width: 0;
  overflow-x: hidden;
  @media (max-width: ${MOBILE_VIEWPORT}px) {
    padding-left: ${themeCssVariables.spacing[1]};
  }
`;

const StyledTitleContainer = styled.div`
  align-items: center;
  color: ${PAGE_HEADER_FOREGROUND};
  display: flex;
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
  margin-right: ${themeCssVariables.spacing[1]};
  overflow: hidden;
  width: 100%;
`;

const StyledTopBarIconStyledTitleContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${themeCssVariables.spacing[1]};
  overflow: hidden;
  width: 100%;
`;

const StyledPageActionContainer = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 0;
  gap: ${themeCssVariables.spacing[2]};

  justify-content: flex-end;
  min-width: 0;
`;

const StyledIconContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
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
  const { theme, colorScheme: themeColorScheme } = useContext(ThemeContext);

  return (
    <AnimatePresence initial={false}>
      <StyledTopBarContainer
        className={className}
        isMobile={isMobile}
        data-color-scheme={themeColorScheme}
      >
        <StyledLeftContainer>
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
            {isDefined(title) && (
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
    </AnimatePresence>
  );
};
