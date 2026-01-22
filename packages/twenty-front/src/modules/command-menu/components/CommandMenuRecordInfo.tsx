import { viewableRecordIdComponentState } from '@/command-menu/pages/record-page/states/viewableRecordIdComponentState';
import { viewableRecordNameSingularComponentState } from '@/command-menu/pages/record-page/states/viewableRecordNameSingularComponentState';
import { useLabelIdentifierFieldMetadataItem } from '@/object-metadata/hooks/useLabelIdentifierFieldMetadataItem';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useIsRecordFieldReadOnly } from '@/object-record/read-only/hooks/useIsRecordFieldReadOnly';
import { FieldContext } from '@/object-record/record-field/ui/contexts/FieldContext';
import { useRecordShowContainerActions } from '@/object-record/record-show/hooks/useRecordShowContainerActions';
import { useRecordShowPage } from '@/object-record/record-show/hooks/useRecordShowPage';
import { recordStoreFamilySelector } from '@/object-record/record-store/states/selectors/recordStoreFamilySelector';
import { recordStoreIdentifierFamilySelector } from '@/object-record/record-store/states/selectors/recordStoreIdentifierSelector';
import { RecordTitleCell } from '@/object-record/record-title-cell/components/RecordTitleCell';
import { RecordTitleCellContainerType } from '@/object-record/record-title-cell/types/RecordTitleCellContainerType';
import { useRecoilComponentValue } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValue';
import { Trans } from '@lingui/react/macro';
import { isNonEmptyString } from '@sniptt/guards';
import { useRecoilValue } from 'recoil';
import { Avatar } from 'twenty-ui/display';
import { FieldMetadataType } from '~/generated-metadata/graphql';
import { dateLocaleState } from '~/localization/states/dateLocaleState';
import { beautifyPastDateRelativeToNow } from '~/utils/date-utils';
import { CommandMenuPageInfoLayout } from './CommandMenuPageInfoLayout';
import styled from '@emotion/styled';
import { isFieldFullName } from '@/object-record/record-field/ui/types/guards/isFieldFullName';
import { isFieldFullNameValue } from '@/object-record/record-field/ui/types/guards/isFieldFullNameValue';
import { CommandMenuContextChip } from '@/command-menu/components/CommandMenuContextChip';

const StyledNameChipsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  align-items: center;
`;

export const CommandMenuRecordInfo = ({
  commandMenuPageInstanceId,
}: {
  commandMenuPageInstanceId: string;
}) => {
  const viewableRecordNameSingular = useRecoilComponentValue(
    viewableRecordNameSingularComponentState,
    commandMenuPageInstanceId,
  );

  const viewableRecordId = useRecoilComponentValue(
    viewableRecordIdComponentState,
    commandMenuPageInstanceId,
  );

  const { objectNameSingular, objectRecordId } = useRecordShowPage(
    viewableRecordNameSingular!,
    viewableRecordId!,
  );

  const recordCreatedAt = useRecoilValue<string | null>(
    recordStoreFamilySelector({
      recordId: objectRecordId,
      fieldName: 'createdAt',
    }),
  );

  const recordIdentifier = useRecoilValue(
    recordStoreIdentifierFamilySelector({
      recordId: objectRecordId,
    }),
  );

  const { localeCatalog } = useRecoilValue(dateLocaleState);
  const beautifiedCreatedAt = isNonEmptyString(recordCreatedAt)
    ? beautifyPastDateRelativeToNow(recordCreatedAt, localeCatalog)
    : '';

  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const { labelIdentifierFieldMetadataItem } =
    useLabelIdentifierFieldMetadataItem({
      objectNameSingular,
    });

  const isTitleReadOnly = useIsRecordFieldReadOnly({
    recordId: objectRecordId,
    fieldMetadataId: labelIdentifierFieldMetadataItem?.id ?? '',
    objectMetadataId: objectMetadataItem.id,
  });

  const { useUpdateOneObjectRecordMutation } = useRecordShowContainerActions({
    objectNameSingular,
    objectRecordId,
  });

  const fieldDefinition = {
    type: labelIdentifierFieldMetadataItem?.type ?? FieldMetadataType.TEXT,
    iconName: '',
    fieldMetadataId: labelIdentifierFieldMetadataItem?.id ?? '',
    label: labelIdentifierFieldMetadataItem?.label ?? '',
    metadata: {
      fieldName: labelIdentifierFieldMetadataItem?.name ?? '',
      objectMetadataNameSingular: objectNameSingular,
    },
    defaultValue: labelIdentifierFieldMetadataItem?.defaultValue,
  };
  
 // Check if the label identifier is a FullName field
  const isFullNameField = isFieldFullName(fieldDefinition);

  // Get the full name field value (always call hook, but only use if it's a FullName field)
  const fullNameFieldValue = useRecoilValue(
    recordStoreFamilySelector({
      recordId: objectRecordId,
      fieldName: labelIdentifierFieldMetadataItem?.name ?? '',
    }),
  );

  // Extract firstName and lastName if it's a FullName field
  const firstName = isFullNameField && isFieldFullNameValue(fullNameFieldValue)
    ? fullNameFieldValue.firstName
    : null;
  const lastName = isFullNameField && isFieldFullNameValue(fullNameFieldValue)
    ? fullNameFieldValue.lastName
    : null;

  // Render firstName and lastName as separate chips if available
  const titleContent = isFullNameField && (isNonEmptyString(firstName) || isNonEmptyString(lastName)) ? (
    <StyledNameChipsContainer>
      {isNonEmptyString(firstName) && (
        <CommandMenuContextChip
          Icons={[]}
          text={firstName}
          maxWidth="120px"
        />
      )}
      {isNonEmptyString(lastName) && (
        <CommandMenuContextChip
          Icons={[]}
          text={lastName}
          maxWidth="120px"
        />
      )}
    </StyledNameChipsContainer>
  ) : (
    <FieldContext.Provider
      value={{
        recordId: objectRecordId,
        isLabelIdentifier: false,
        fieldDefinition,
        useUpdateRecord: useUpdateOneObjectRecordMutation,
        isCentered: false,
        isDisplayModeFixHeight: true,
        isRecordFieldReadOnly: isTitleReadOnly,
      }}
    >
      <RecordTitleCell
        sizeVariant="sm"
        containerType={RecordTitleCellContainerType.PageHeader}
      />
    </FieldContext.Provider>
  );

  return (
    <CommandMenuPageInfoLayout
      icon={
        recordIdentifier ? (
          <Avatar
            avatarUrl={recordIdentifier.avatarUrl}
            placeholder={recordIdentifier.name}
            placeholderColorSeed={objectRecordId}
            size="md"
            type={recordIdentifier.avatarType}
          />
        ) : undefined
      }
      title={titleContent}
      label={
        beautifiedCreatedAt ? (
          <Trans>Created {beautifiedCreatedAt}</Trans>
        ) : undefined
      }
    />
  );
};
