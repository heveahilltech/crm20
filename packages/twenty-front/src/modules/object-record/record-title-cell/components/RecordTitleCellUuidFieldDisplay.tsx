import { FieldContext } from '@/object-record/record-field/ui/contexts/FieldContext';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { useAtomFamilyStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilyStateValue';
import { RecordTitleCellContainerType } from '@/object-record/record-title-cell/types/RecordTitleCellContainerType';
import { styled } from '@linaria/react';
import { useContext } from 'react';
import { OverflowingTextWithTooltip } from 'twenty-ui/display';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledDiv = styled.div`
  align-items: center;
  background: inherit;
  border: none;
  border-radius: ${themeCssVariables.border.radius.sm};
  box-sizing: border-box;
  color: ${themeCssVariables.font.color.primary};
  display: flex;
  height: 24px;
  justify-content: center;
  overflow: hidden;
  padding: ${themeCssVariables.spacing[0]} 5px;

  &[data-container-type='${RecordTitleCellContainerType.PageHeader}'] {
    color: inherit;
  }
`;

export const RecordTitleCellUuidFieldDisplay = ({
  containerType,
}: {
  containerType: RecordTitleCellContainerType;
}) => {
  const { recordId, fieldDefinition } = useContext(FieldContext);

  const recordStore = useAtomFamilyStateValue(recordStoreFamilyState, recordId);

  const uuidValue = recordStore?.[fieldDefinition.metadata.fieldName] ?? '';

  return (
    <StyledDiv data-container-type={containerType}>
      <OverflowingTextWithTooltip text={uuidValue} />
    </StyledDiv>
  );
};
