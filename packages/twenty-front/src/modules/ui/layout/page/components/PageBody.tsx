import { styled } from '@linaria/react';
import { type ReactNode } from 'react';

import { PagePanel } from './PagePanel';
import { pageBodyPreset } from '@/ui/theme/utils/themeUtils';
import { themeCssVariables } from 'twenty-ui/theme-constants';

type PageBodyProps = {
  children: ReactNode;
  className?: string;
};

const StyledMainContainer = styled.div`
  ${({ theme }) => pageBodyPreset(theme)}
`;

type LeftContainerProps = {
  isSidePanelOpen?: boolean;
};

const StyledLeftContainer = styled.div<LeftContainerProps>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
`;

export const PageBody = ({ children, className }: PageBodyProps) => (
  <StyledMainContainer className={className}>
    <StyledLeftContainer>
      <PagePanel>{children}</PagePanel>
    </StyledLeftContainer>
  </StyledMainContainer>
);