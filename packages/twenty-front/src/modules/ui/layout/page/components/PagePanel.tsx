import { styled } from '@linaria/react';
import React from 'react';
import { pagePanelPreset } from '@/ui/theme/utils/themeUtils';

const StyledPanel = styled.div`
  ${({ theme }) => pagePanelPreset(theme)}
`;

type PagePanelProps = {
  children: React.ReactNode;
  hasInformationBar?: boolean;
};

export const PagePanel = ({ children }: PagePanelProps) => (
  <StyledPanel>{children}</StyledPanel>
);
