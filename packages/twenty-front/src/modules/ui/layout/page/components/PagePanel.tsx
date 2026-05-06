import { styled } from '@linaria/react';
import React from 'react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledPanel = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: hidden;
  width: 100%;
`;

type PagePanelProps = {
  children: React.ReactNode;
  hasInformationBar?: boolean;
};

export const PagePanel = ({ children }: PagePanelProps) => (
  <StyledPanel>{children}</StyledPanel>
);
