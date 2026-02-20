import { COMMAND_MENU_COMPONENT_INSTANCE_ID } from '@/command-menu/constants/CommandMenuComponentInstanceId';
import { commandMenuPendingPageLayoutRecordIdState } from '@/command-menu/states/commandMenuPendingPageLayoutRecordIdState';
import { ChartSettings } from '@/command-menu/pages/page-layout/components/ChartSettings';
import { WidgetSettingsFooter } from '@/command-menu/pages/page-layout/components/WidgetSettingsFooter';
import { usePageLayoutIdFromContextStoreTargetedRecord } from '@/command-menu/pages/page-layout/hooks/usePageLayoutFromContextStoreTargetedRecord';
import { isChartWidget } from '@/command-menu/pages/page-layout/utils/isChartWidget';
import { contextStoreNumberOfSelectedRecordsComponentState } from '@/context-store/states/contextStoreNumberOfSelectedRecordsComponentState';
import { contextStoreTargetedRecordsRuleComponentState } from '@/context-store/states/contextStoreTargetedRecordsRuleComponentState';
import { pageLayoutDraftComponentState } from '@/page-layout/states/pageLayoutDraftComponentState';
import { pageLayoutEditingWidgetIdComponentState } from '@/page-layout/states/pageLayoutEditingWidgetIdComponentState';
import { WidgetComponentInstanceContext } from '@/page-layout/widgets/states/contexts/WidgetComponentInstanceContext';
import { useSetRecoilComponentState } from '@/ui/utilities/state/component-state/hooks/useSetRecoilComponentState';
import { useRecoilComponentValue } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValue';
import styled from '@emotion/styled';
import { useLayoutEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isDefined } from 'twenty-shared/utils';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const CommandMenuPageLayoutChartSettingsContent = () => {
  const { pageLayoutId } = usePageLayoutIdFromContextStoreTargetedRecord();

  const draftPageLayout = useRecoilComponentValue(
    pageLayoutDraftComponentState,
    pageLayoutId,
  );

  const pageLayoutEditingWidgetId = useRecoilComponentValue(
    pageLayoutEditingWidgetIdComponentState,
    pageLayoutId,
  );

  const widgetInEditMode = draftPageLayout.tabs
    .flatMap((tab) => tab.widgets)
    .find((widget) => widget.id === pageLayoutEditingWidgetId);

  if (!isDefined(widgetInEditMode) || !isChartWidget(widgetInEditMode)) {
    return null;
  }

  return (
    <StyledContainer>
      <WidgetComponentInstanceContext.Provider
        value={{ instanceId: widgetInEditMode.id }}
      >
        <ChartSettings widget={widgetInEditMode} />
        <WidgetSettingsFooter pageLayoutId={pageLayoutId} />
      </WidgetComponentInstanceContext.Provider>
    </StyledContainer>
  );
};
export const CommandMenuPageLayoutChartSettings = () => {
  const pendingRecordId = useRecoilValue(
    commandMenuPendingPageLayoutRecordIdState,
  );
  const setPendingRecordId = useSetRecoilState(
    commandMenuPendingPageLayoutRecordIdState,
  );
  const setContextStoreTargetedRecords = useSetRecoilComponentState(
    contextStoreTargetedRecordsRuleComponentState,
    COMMAND_MENU_COMPONENT_INSTANCE_ID,
  );
  const setContextStoreNumberOfSelectedRecords = useSetRecoilComponentState(
    contextStoreNumberOfSelectedRecordsComponentState,
    COMMAND_MENU_COMPONENT_INSTANCE_ID,
  );

  useLayoutEffect(() => {
    if (isDefined(pendingRecordId)) {
      setContextStoreTargetedRecords({
        mode: 'selection',
        selectedRecordIds: [pendingRecordId],
      });
      setContextStoreNumberOfSelectedRecords(1);
      setPendingRecordId(null);
    }
  }, [
    pendingRecordId,
    setContextStoreTargetedRecords,
    setContextStoreNumberOfSelectedRecords,
    setPendingRecordId,
  ]);

  if (isDefined(pendingRecordId)) {
    return null;
  }

  return <CommandMenuPageLayoutChartSettingsContent />;
};

