import { ActionMenuContextProvider } from '@/action-menu/contexts/ActionMenuContextProvider';
import { CommandMenuContainer } from '@/command-menu/components/CommandMenuContainer';
import { CommandMenuTopBar } from '@/command-menu/components/CommandMenuTopBar';
import { COMMAND_MENU_PAGES_CONFIG } from '@/command-menu/constants/CommandMenuPagesConfig';
import { commandMenuPageInfoState } from '@/command-menu/states/commandMenuPageInfoState';
import { commandMenuPageState } from '@/command-menu/states/commandMenuPageState';
import { CommandMenuPageComponentInstanceContext } from '@/command-menu/states/contexts/CommandMenuPageComponentInstanceContext';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import { isDefined } from 'twenty-shared/utils';
import React from 'react';
import { CommandMenuPages } from '@/command-menu/types/CommandMenuPages';

const StyledCommandMenuContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const CommandMenuRouter = () => {
  const commandMenuPage = useRecoilValue(commandMenuPageState);
  const commandMenuPageInfo = useRecoilValue(commandMenuPageInfoState);

   const theme = useTheme();

  // Ensure we have a valid page, default to Root if not set
  const pageToRender = isDefined(commandMenuPage)
    ? commandMenuPage
    : CommandMenuPages.Root;

  const commandMenuPageComponent = COMMAND_MENU_PAGES_CONFIG.get(pageToRender);

  if (!commandMenuPageComponent) {
    return (
      <CommandMenuContainer>
        <CommandMenuPageComponentInstanceContext.Provider
          value={{ instanceId: commandMenuPageInfo.instanceId || 'default' }}
        >
          <CommandMenuTopBar />
          <StyledCommandMenuContent>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              Page not found: {pageToRender}
            </div>
          </StyledCommandMenuContent>
        </CommandMenuPageComponentInstanceContext.Provider>
      </CommandMenuContainer>
    );
  }

  return (
    <CommandMenuContainer>
      <CommandMenuPageComponentInstanceContext.Provider
        value={{ instanceId: commandMenuPageInfo.instanceId }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: theme.animation.duration.instant,
            delay: 0.1,
          }}
        >
          <CommandMenuTopBar />
        </motion.div>
        <StyledCommandMenuContent>
          <ActionMenuContextProvider
            isInRightDrawer={true}
            displayType="listItem"
            actionMenuType="command-menu"
          >
            <React.Fragment key={pageToRender}>
              {commandMenuPageComponent}
            </React.Fragment>
          </ActionMenuContextProvider>
        </StyledCommandMenuContent>
      </CommandMenuPageComponentInstanceContext.Provider>
    </CommandMenuContainer>
  );
};
