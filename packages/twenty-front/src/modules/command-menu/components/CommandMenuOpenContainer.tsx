import { COMMAND_MENU_ANIMATION_VARIANTS } from '@/command-menu/constants/CommandMenuAnimationVariants';
import { COMMAND_MENU_CLICK_OUTSIDE_ID } from '@/command-menu/constants/CommandMenuClickOutsideId';
import { SIDE_PANEL_FOCUS_ID } from '@/command-menu/constants/SidePanelFocusId';
import { useCommandMenu } from '@/command-menu/hooks/useCommandMenu';
import { type CommandMenuAnimationVariant } from '@/command-menu/types/CommandMenuAnimationVariant';
import { RECORD_CHIP_CLICK_OUTSIDE_ID } from '@/object-record/record-table/constants/RecordChipClickOutsideId';
import { SLASH_MENU_DROPDOWN_CLICK_OUTSIDE_ID } from '@/ui/input/constants/SlashMenuDropdownClickOutsideId';
import { RootStackingContextZIndices } from '@/ui/layout/constants/RootStackingContextZIndices';
import { PAGE_HEADER_COMMAND_MENU_BUTTON_CLICK_OUTSIDE_ID } from '@/ui/layout/page-header/constants/PageHeaderCommandMenuButtonClickOutsideId';
import { currentFocusIdSelector } from '@/ui/utilities/focus/states/currentFocusIdSelector';
import { useListenClickOutside } from '@/ui/utilities/pointer-event/hooks/useListenClickOutside';
import { WORKFLOW_DIAGRAM_CREATE_STEP_NODE_CLICK_OUTSIDE_ID } from '@/workflow/workflow-diagram/constants/WorkflowDiagramCreateStepNodeClickOutsideId';
import { WORKFLOW_DIAGRAM_EDGE_OPTIONS_CLICK_OUTSIDE_ID } from '@/workflow/workflow-diagram/workflow-edges/constants/WorkflowDiagramEdgeOptionsClickOutsideId';
import { WORKFLOW_DIAGRAM_STEP_NODE_BASE_CLICK_OUTSIDE_ID } from '@/workflow/workflow-diagram/constants/WorkflowDiagramStepNodeClickOutsideId';
import { useTheme } from '@emotion/react';

import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { LINK_CHIP_CLICK_OUTSIDE_ID } from 'twenty-ui/components';
import { useIsMobile } from 'twenty-ui/utilities';
import { COMMAND_MENU_SIDE_PANEL_WIDTH } from '@/command-menu/constants/CommandMenuSidePanelWidth';
import { isCommandMenuOpenedState } from '@/command-menu/states/isCommandMenuOpenedState';
import { ModalContainerContext } from '@/ui/layout/modal/contexts/ModalContainerContext';
import { MOBILE_VIEWPORT } from 'twenty-ui/theme';

const StyledBackdrop = styled(motion.div)`
  align-items: center;
  background: ${({ theme }) => theme.background.overlayPrimary || 'rgba(0, 0, 0, 0.6)'};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  height: 100dvh;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: ${RootStackingContextZIndices.RootModalBackDrop};
  user-select: none;
  pointer-events: auto;
`;

const StyledCommandMenu = styled(motion.div)`
   background: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  box-shadow: ${({ theme }) => theme.boxShadow.superHeavy};
  font-family: ${({ theme }) => theme.font.family};
  height: auto;
  max-height: 90dvh;
  overflow: hidden;
  padding: 0;
  position: relative;
  width: ${COMMAND_MENU_SIDE_PANEL_WIDTH}px;
  z-index: ${RootStackingContextZIndices.RootModal};
  display: flex;
  flex-direction: column;
 @media (max-width: ${MOBILE_VIEWPORT}px) {
    width: 100vw;
    height: 100dvh;
    max-height: 100dvh;
    border-radius: 0;
  }
`;

export const CommandMenuOpenContainer = ({
  children,
}: React.PropsWithChildren) => {
  const isMobile = useIsMobile();
  const isCommandMenuOpened = useRecoilValue(isCommandMenuOpenedState);

  const targetVariantForAnimation: CommandMenuAnimationVariant = isMobile
    ? 'fullScreen'
    : 'normal';

  const theme = useTheme();

  const { closeCommandMenu } = useCommandMenu();

  const commandMenuRef = useRef<HTMLDivElement>(null);
  const [modalContainer, setModalContainer] = useState<HTMLDivElement | null>(
    null,
  );

  const handleModalContainerRef = useCallback(
    (element: HTMLDivElement | null) => {
      setModalContainer(element);
    },
    [],
  );

  const handleClickOutside = useRecoilCallback(
  ({ snapshot }) =>
    () => {
      const currentFocusId = snapshot
        .getLoadable(currentFocusIdSelector)
        .getValue();

      if (currentFocusId === SIDE_PANEL_FOCUS_ID) {
        
        closeCommandMenu();
      }
    },
  [closeCommandMenu],
);

  useListenClickOutside({
    refs: [commandMenuRef],
    callback: handleClickOutside,
    listenerId: 'COMMAND_MENU_LISTENER_ID',
    excludedClickOutsideIds: [
      PAGE_HEADER_COMMAND_MENU_BUTTON_CLICK_OUTSIDE_ID,
      LINK_CHIP_CLICK_OUTSIDE_ID,
      RECORD_CHIP_CLICK_OUTSIDE_ID,
      SLASH_MENU_DROPDOWN_CLICK_OUTSIDE_ID,
      WORKFLOW_DIAGRAM_STEP_NODE_BASE_CLICK_OUTSIDE_ID,
      WORKFLOW_DIAGRAM_EDGE_OPTIONS_CLICK_OUTSIDE_ID,
      WORKFLOW_DIAGRAM_CREATE_STEP_NODE_CLICK_OUTSIDE_ID,
    ],
  });

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the backdrop, not on the modal content
    if (e.target === e.currentTarget) {
      handleClickOutside();
    }
  };

  const stopEventPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isCommandMenuOpened) {
    return null;
  }

  return (
    <AnimatePresence>
      <StyledBackdrop
        key="command-menu-backdrop"
        data-testid="command-menu-backdrop"
        data-click-outside-id={COMMAND_MENU_CLICK_OUTSIDE_ID}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: theme.animation.duration.normal }}
        onClick={handleBackdropClick}
      >
        <StyledCommandMenu
          key="command-menu"
          data-testid="command-menu"
          ref={commandMenuRef}
          initial="closed"
          animate={targetVariantForAnimation}
          exit="closed"
          variants={COMMAND_MENU_ANIMATION_VARIANTS}
          transition={{ duration: theme.animation.duration.normal }}
          onClick={stopEventPropagation}
        >
          <div
            ref={handleModalContainerRef}
            style={{
              height: '100%',
              left: 0,
              pointerEvents: 'none',
              position: 'absolute',
              top: 0,
              width: '100%',
              zIndex: 1,
            }}
          />
          <ModalContainerContext.Provider value={{ container: modalContainer }}>
            {children}
          </ModalContainerContext.Provider>
        </StyledCommandMenu>
      </StyledBackdrop>
    </AnimatePresence>
  );
};
