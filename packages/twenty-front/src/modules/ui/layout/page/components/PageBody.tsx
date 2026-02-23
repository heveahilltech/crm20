import styled from '@emotion/styled';
import { type ReactNode } from 'react';

import { PagePanel } from './PagePanel';
import { pageBodyPreset } from '@/ui/theme/utils/themeUtils';

type PageBodyProps = {
  children: ReactNode;
  className?: string;
};

const StyledMainContainer = styled.div`
  ${({ theme }) => pageBodyPreset(theme)}
`;

type LeftContainerProps = {
  isRightDrawerOpen?: boolean;
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
