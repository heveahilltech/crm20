import { useIsFieldInputOnly } from '@/object-record/record-field/ui/hooks/useIsFieldInputOnly';
import { RecordFieldComponentInstanceContext } from '@/object-record/record-field/ui/states/contexts/RecordFieldComponentInstanceContext';
import { recordFieldInputIsFieldInErrorComponentState } from '@/object-record/record-field/ui/states/recordFieldInputIsFieldInErrorComponentState';
import { recordFieldInputLayoutDirectionComponentState } from '@/object-record/record-field/ui/states/recordFieldInputLayoutDirectionComponentState';
import { recordFieldInputLayoutDirectionLoadingComponentState } from '@/object-record/record-field/ui/states/recordFieldInputLayoutDirectionLoadingComponentState';
import { TABLE_Z_INDEX } from '@/object-record/record-table/constants/TableZIndex';
import { RecordTableCellContext } from '@/object-record/record-table/contexts/RecordTableCellContext';
import { useFocusRecordTableCell } from '@/object-record/record-table/record-table-cell/hooks/useFocusRecordTableCell';
import { OverlayContainer } from '@/ui/layout/overlay/components/OverlayContainer';
import { useAvailableComponentInstanceIdOrThrow } from '@/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceIdOrThrow';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { styled } from '@linaria/react';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  type MiddlewareState,
  type Placement,
} from '@floating-ui/react';
import { useContext, type ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const RECORD_TABLE_DATE_PICKER_VIEWPORT_PADDING = 16;

const StyledRecordTableCellDatePickerOverlay = styled(OverlayContainer)`
  align-items: stretch;
  backdrop-filter: none;
  background: ${themeCssVariables.background.primary};
  color: ${themeCssVariables.font.color.primary};
  flex-direction: column;
  overflow-x: visible;
  overflow-y: auto;
  z-index: ${TABLE_Z_INDEX.cell.editMode};
`;

const StyledEditableCellEditModeContainer = styled.div<{
  isFieldInputOnly: boolean;
}>`
  align-items: center;
  display: flex;
  height: 100%;
  position: absolute;
  width: calc(100% + 2px);
`;

const StyledInputModeOnlyContainer = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  overflow: hidden;
  padding-left: 8px;
  width: 100%;
`;

export type RecordTableCellEditModeProps = {
  children: ReactElement;
};

export const RecordTableCellEditMode = ({
  children,
}: RecordTableCellEditModeProps) => {
  const recordFieldInputIsFieldInError = useAtomComponentStateValue(
    recordFieldInputIsFieldInErrorComponentState,
  );

  const recordFieldComponentInstanceId = useAvailableComponentInstanceIdOrThrow(
    RecordFieldComponentInstanceContext,
  );
  const setRecordFieldInputLayoutDirection = useSetAtomComponentState(
    recordFieldInputLayoutDirectionComponentState,
    recordFieldComponentInstanceId,
  );

  const setRecordFieldInputLayoutDirectionLoading = useSetAtomComponentState(
    recordFieldInputLayoutDirectionLoadingComponentState,
    recordFieldComponentInstanceId,
  );

  const setFieldInputLayoutDirectionMiddleware = {
    name: 'middleware',
    fn: async (state: MiddlewareState) => {
      setRecordFieldInputLayoutDirection(
        state.placement.startsWith('bottom') ? 'downward' : 'upward',
      );
      setRecordFieldInputLayoutDirectionLoading(false);
      return {};
    },
  };

  const datePickerBoundaryPadding = RECORD_TABLE_DATE_PICKER_VIEWPORT_PADDING;

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    strategy: 'fixed',
    middleware: [
      offset(({ placement }: { placement: Placement }) => ({
        mainAxis: placement.startsWith('top') ? 8 : 4,
        crossAxis: -3,
      })),
      flip({ padding: datePickerBoundaryPadding }),
      shift({ padding: datePickerBoundaryPadding }),
      size({
        padding: datePickerBoundaryPadding,
        apply({
          availableHeight,
          elements,
        }: {
          availableHeight: number;
          elements: { floating: HTMLElement; reference: HTMLElement };
        }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.max(availableHeight, 0)}px`,
          });
        },
      }),
      setFieldInputLayoutDirectionMiddleware,
    ],

    whileElementsMounted: autoUpdate,
  });

  const isFieldInputOnly = useIsFieldInputOnly();

  const { cellPosition } = useContext(RecordTableCellContext);

  const { focusRecordTableCell } = useFocusRecordTableCell();

  return (
    <StyledEditableCellEditModeContainer
      ref={refs.setReference}
      data-testid="editable-cell-edit-mode-container"
      isFieldInputOnly={isFieldInputOnly}
    >
      {isFieldInputOnly ? (
        <StyledInputModeOnlyContainer
          onClick={() => {
            focusRecordTableCell(cellPosition);
          }}
        >
          {children}
        </StyledInputModeOnlyContainer>
      ) : (
        createPortal(
          <StyledRecordTableCellDatePickerOverlay
            ref={refs.setFloating}
            style={floatingStyles}
            borderRadius="sm"
            hasDangerBorder={recordFieldInputIsFieldInError}
          >
            {children}
          </StyledRecordTableCellDatePickerOverlay>,
          document.body,
        )
      )}
    </StyledEditableCellEditModeContainer>
  );
};
