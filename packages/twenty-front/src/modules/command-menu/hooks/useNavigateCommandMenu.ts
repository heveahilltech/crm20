import { COMMAND_MENU_COMPONENT_INSTANCE_ID } from '@/command-menu/constants/CommandMenuComponentInstanceId';
import { SIDE_PANEL_FOCUS_ID } from '@/command-menu/constants/SidePanelFocusId';
import { useCommandMenuCloseAnimationCompleteCleanup } from '@/command-menu/hooks/useCommandMenuCloseAnimationCompleteCleanup';
import { useCopyContextStoreStates } from '@/command-menu/hooks/useCopyContextStoreAndActionMenuStates';
import { commandMenuNavigationMorphItemsByPageState } from '@/command-menu/states/commandMenuNavigationMorphItemsByPageState';
import { commandMenuNavigationStackState } from '@/command-menu/states/commandMenuNavigationStackState';
import { commandMenuPageInfoState } from '@/command-menu/states/commandMenuPageInfoState';
import { commandMenuPageState } from '@/command-menu/states/commandMenuPageState';
import { commandMenuShouldFocusTitleInputComponentState } from '@/command-menu/states/commandMenuShouldFocusTitleInputComponentState';
import { hasUserSelectedCommandState } from '@/command-menu/states/hasUserSelectedCommandState';
import { isCommandMenuClosingState } from '@/command-menu/states/isCommandMenuClosingState';
import { isCommandMenuOpenedState } from '@/command-menu/states/isCommandMenuOpenedState';
<<<<<<< HEAD
import { isCommandMenuOpenedStateV2 } from '@/command-menu/states/isCommandMenuOpenedStateV2';
=======

>>>>>>> hevea-local
import { MAIN_CONTEXT_STORE_INSTANCE_ID } from '@/context-store/constants/MainContextStoreInstanceId';
import { usePushFocusItemToFocusStack } from '@/ui/utilities/focus/hooks/usePushFocusItemToFocusStack';
import { FocusComponentType } from '@/ui/utilities/focus/types/FocusComponentType';
import { useStore } from 'jotai';
import { useRecoilCallback } from 'recoil';
import { type CommandMenuPages } from 'twenty-shared/types';
import { type IconComponent } from 'twenty-ui/display';
import { v4 } from 'uuid';
import { commandMenuPendingPageLayoutRecordIdState } from '@/command-menu/states/commandMenuPendingPageLayoutRecordIdState';
import { contextStoreNumberOfSelectedRecordsComponentState } from '@/context-store/states/contextStoreNumberOfSelectedRecordsComponentState';
import { contextStoreTargetedRecordsRuleComponentState } from '@/context-store/states/contextStoreTargetedRecordsRuleComponentState';
import { isDefined } from 'twenty-shared/utils';
import { CommandMenuPages } from '@/command-menu/types/CommandMenuPages';

export type CommandMenuNavigationStackItem = {
  page: CommandMenuPages;
  pageTitle: string;
  pageIcon: IconComponent;
  pageIconColor?: string;
  pageId?: string;
};

export const useNavigateCommandMenu = () => {
  const { copyContextStoreStates } = useCopyContextStoreStates();

  const { commandMenuCloseAnimationCompleteCleanup } =
    useCommandMenuCloseAnimationCompleteCleanup();

  const { pushFocusItemToFocusStack } = usePushFocusItemToFocusStack();

  const store = useStore();

  const openCommandMenu = useRecoilCallback(
    ({ snapshot, set }) =>
      () => {
        const isCommandMenuOpened = snapshot
          .getLoadable(isCommandMenuOpenedState)
          .getValue();

        const isCommandMenuClosing = snapshot
          .getLoadable(isCommandMenuClosingState)
          .getValue();

        if (isCommandMenuClosing) {
          commandMenuCloseAnimationCompleteCleanup();
        }

        if (isCommandMenuOpened) {
          return;
        }

        pushFocusItemToFocusStack({
          focusId: SIDE_PANEL_FOCUS_ID,
          component: {
            type: FocusComponentType.SIDE_PANEL,
            instanceId: COMMAND_MENU_COMPONENT_INSTANCE_ID,
          },
          globalHotkeysConfig: {
            enableGlobalHotkeysConflictingWithKeyboard: false,
          },
        });

        copyContextStoreStates({
          instanceIdToCopyFrom: MAIN_CONTEXT_STORE_INSTANCE_ID,
          instanceIdToCopyTo: COMMAND_MENU_COMPONENT_INSTANCE_ID,
        });

        set(isCommandMenuOpenedState, true);
        store.set(isCommandMenuOpenedStateV2.atom, true);
        set(hasUserSelectedCommandState, false);
      },
    [
      copyContextStoreStates,
      commandMenuCloseAnimationCompleteCleanup,
      pushFocusItemToFocusStack,
      store,
    ],
  );

  const navigateCommandMenu = useRecoilCallback(
    ({ snapshot, set }) => {
      return ({
        page,
        pageTitle,
        pageIcon,
        pageIconColor,
        pageId,
        focusTitleInput = false,
        resetNavigationStack = false,
      }: CommandMenuNavigationStackItem & {
        resetNavigationStack?: boolean;
        focusTitleInput?: boolean;
      }) => {
        const computedPageId = pageId || v4();

        openCommandMenu();
        set(commandMenuPageState, page);
        set(commandMenuPageInfoState, {
          title: pageTitle,
          Icon: pageIcon,
          instanceId: computedPageId,
        });

        const isPageLayoutWidgetSettingsPage =
          page === CommandMenuPages.PageLayoutGraphTypeSelect ||
          page === CommandMenuPages.PageLayoutIframeSettings ||
          page === CommandMenuPages.PageLayoutFieldsSettings;

        if (isPageLayoutWidgetSettingsPage) {
          const pendingRecordId = snapshot
            .getLoadable(commandMenuPendingPageLayoutRecordIdState)
            .getValue();

          if (isDefined(pendingRecordId)) {
            set(
              contextStoreTargetedRecordsRuleComponentState.atomFamily({
                instanceId: COMMAND_MENU_COMPONENT_INSTANCE_ID,
              }),
              {
                mode: 'selection',
                selectedRecordIds: [pendingRecordId],
              },
            );
            set(
              contextStoreNumberOfSelectedRecordsComponentState.atomFamily({
                instanceId: COMMAND_MENU_COMPONENT_INSTANCE_ID,
              }),
              1,
            );
            set(commandMenuPendingPageLayoutRecordIdState, null);
          }
        }

        if (focusTitleInput) {
          set(
            commandMenuShouldFocusTitleInputComponentState.atomFamily({
              instanceId: computedPageId,
            }),
            true,
          );
        }

        const isCommandMenuClosing = snapshot
          .getLoadable(isCommandMenuClosingState)
          .getValue();

        const currentNavigationStack = isCommandMenuClosing
          ? []
          : snapshot.getLoadable(commandMenuNavigationStackState).getValue();

        if (resetNavigationStack) {
          set(commandMenuNavigationStackState, [
            {
              page,
              pageTitle,
              pageIcon,
              pageIconColor,
              pageId: computedPageId,
            },
          ]);

          set(commandMenuNavigationMorphItemsByPageState, new Map());
        } else {
          set(commandMenuNavigationStackState, [
            ...currentNavigationStack,
            {
              page,
              pageTitle,
              pageIcon,
              pageIconColor,
              pageId: computedPageId,
            },
          ]);
        }
      };
    },
    [openCommandMenu],
  );

  return {
    navigateCommandMenu,
  };
};
