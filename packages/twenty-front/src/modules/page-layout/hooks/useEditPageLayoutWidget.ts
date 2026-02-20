import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { COMMAND_MENU_COMPONENT_INSTANCE_ID } from '@/command-menu/constants/CommandMenuComponentInstanceId';
import { useCommandMenu } from '@/command-menu/hooks/useCommandMenu';
import { commandMenuPageState } from '@/command-menu/states/commandMenuPageState';
import { commandMenuPendingPageLayoutRecordIdState } from '@/command-menu/states/commandMenuPendingPageLayoutRecordIdState';
import { CommandMenuPages } from '@/command-menu/types/CommandMenuPages';
import { useSetRecoilComponentState } from '@/ui/utilities/state/component-state/hooks/useSetRecoilComponentState';
import { contextStoreNumberOfSelectedRecordsComponentState } from '@/context-store/states/contextStoreNumberOfSelectedRecordsComponentState';
import { contextStoreTargetedRecordsRuleComponentState } from '@/context-store/states/contextStoreTargetedRecordsRuleComponentState';
import { useLayoutRenderingContext } from '@/ui/layout/contexts/LayoutRenderingContext';
import { isDefined } from 'twenty-shared/utils';
import { useNavigatePageLayoutCommandMenu } from '@/command-menu/pages/page-layout/hooks/useNavigatePageLayoutCommandMenu';
import { PageLayoutComponentInstanceContext } from '@/page-layout/states/contexts/PageLayoutComponentInstanceContext';
import { pageLayoutEditingWidgetIdComponentState } from '@/page-layout/states/pageLayoutEditingWidgetIdComponentState';
import { useAvailableComponentInstanceIdOrThrow } from '@/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceIdOrThrow';
import { t } from '@lingui/core/macro';
import { WidgetType } from '~/generated/graphql';

export const useEditPageLayoutWidget = (pageLayoutIdFromProps?: string) => {
  const pageLayoutId = useAvailableComponentInstanceIdOrThrow(
    PageLayoutComponentInstanceContext,
    pageLayoutIdFromProps,
  );

  const { targetRecordIdentifier } = useLayoutRenderingContext();

  const setPageLayoutEditingWidgetId = useSetRecoilComponentState(
    pageLayoutEditingWidgetIdComponentState,
    pageLayoutId,
  );

  const setCommandMenuContextStoreTargetedRecords = useSetRecoilComponentState(
    contextStoreTargetedRecordsRuleComponentState,
    COMMAND_MENU_COMPONENT_INSTANCE_ID,
  );

  const setCommandMenuContextStoreNumberOfSelectedRecords =
    useSetRecoilComponentState(
      contextStoreNumberOfSelectedRecordsComponentState,
      COMMAND_MENU_COMPONENT_INSTANCE_ID,
    );

  const { navigatePageLayoutCommandMenu } = useNavigatePageLayoutCommandMenu();
  const { closeCommandMenu } = useCommandMenu();
  const setCommandMenuPage = useSetRecoilState(commandMenuPageState);
  const setPendingPageLayoutRecordId = useSetRecoilState(
    commandMenuPendingPageLayoutRecordIdState,
  ); 
  const handleEditWidget = useCallback(
    ({
      widgetId,
      widgetType,
    }: {
      widgetId: string;
      widgetType: WidgetType;
    }) => {
      setPageLayoutEditingWidgetId(widgetId);

      const recordId = targetRecordIdentifier?.id;
      if (isDefined(recordId)) {
        setPendingPageLayoutRecordId(recordId);
        setCommandMenuContextStoreTargetedRecords({
          mode: 'selection',
          selectedRecordIds: [recordId],
        });
        setCommandMenuContextStoreNumberOfSelectedRecords(1);
      }

      if (widgetType === WidgetType.IFRAME) {
        navigatePageLayoutCommandMenu({
          commandMenuPage: CommandMenuPages.PageLayoutIframeSettings,
          pageTitle: t`Edit iFrame`,
          resetNavigationStack: true,
        });
        return;
      }

      if (widgetType === WidgetType.GRAPH) {
        navigatePageLayoutCommandMenu({
          commandMenuPage: CommandMenuPages.PageLayoutGraphTypeSelect,
          pageTitle: t`Edit Graph`,
          resetNavigationStack: true,
        });
        return;
      }

      if (widgetType === WidgetType.FIELDS) {
        navigatePageLayoutCommandMenu({
          commandMenuPage: CommandMenuPages.PageLayoutFieldsSettings,
          pageTitle: t`Edit Fields`,
          resetNavigationStack: true,
        });
        return;
      }

      setCommandMenuPage(CommandMenuPages.Root);
      closeCommandMenu();
    },
    [
      setPageLayoutEditingWidgetId,
      targetRecordIdentifier?.id,
      setPendingPageLayoutRecordId,
      setCommandMenuContextStoreTargetedRecords,
      setCommandMenuContextStoreNumberOfSelectedRecords,
      navigatePageLayoutCommandMenu,
      closeCommandMenu,
      setCommandMenuPage,
    ],
  );

  return {
    handleEditWidget,
  };
};
