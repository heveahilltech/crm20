import { useLabelIdentifierFieldMetadataItem } from '@/object-metadata/hooks/useLabelIdentifierFieldMetadataItem';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { useObjectPermissions } from '@/object-record/hooks/useObjectPermissions';
import { categorizeRelationFields } from '@/object-record/record-field-list/utils/categorizeRelationFields';
import { isFieldCellSupported } from '@/object-record/utils/isFieldCellSupported';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import groupBy from 'lodash.groupby';
import { FieldMetadataType } from 'twenty-shared/types';
import { FeatureFlagKey } from '~/generated/graphql';

// Custom field order configuration
const CUSTOM_FIELD_ORDER: Record<string, string[]> = {
  "location": ["effectiveDate", "termDate", "locationCode", "description", "timezone", "emails", "defaultOperatingHours"],
  "offering": ["effectiveDate", "termDate", "offeringCode", "durationMinutes", "bufferBeforeMinutes", "bufferAfterMinutes", "cancellationHoursDuration"],
  "phoneNumber": ["phonePrimaryPhoneNumber", "phonePrimaryPhoneCountryCode", "phonePrimaryPhoneCallingCode", "phoneAdditionalPhones", "phoneLabel", "location"],
  "workingHoursRule": ["effectiveDate", "termDate", "dayOfWeek", "startTimeLocal", "endTimeLocal", "maxConcurrentCapacity", "availabilitySchedule"],
  "resource": ["effectiveDate", "termDate", "resourceCode", "resourceType", "description", "defaultTimezone"],
  "resourceOfferingCapability": ["effectiveDate", "termDate", "isPrimary", "proficiencyLevel", "offering", "resource"],
  "availabilitySchedule": ["effectiveDate", "termDate", "scheduleName"],
  "availabilityException": ["startUtc", "endUtc", "exceptionType", "reason", "isRecurring", "recurrenceRule", "availabilitySchedule"],
  "appointment": ["description", "reason", "appointmentStatus", "startUtc", "endUtc", "appointmentTimezone", "internalNotes", "confirmationStatus", "confirmedAt", "reminderPreference", "reminderSentAt", "reminderCount", "agentSessionId", "agentTranscript", "cancelledAt", "cancelledBy", "cancellationReason"],
  "appointmentHistory": ["historyAction", "changedByName", "oldValue", "newValue", "changeReason", "appointment"],
  "customer": ["personId"],
  "person": ["dateOfBirth", "gender", "personType", "specializations", "credentials", "preferredLanguage", "communicationPreferences", "languages"],
  "personIdentifier": ["identifierType", "identifierValue", "isPrimary", "identifierMetadata", "person"]
};

type UseFieldListFieldMetadataItemsProps = {
  objectNameSingular: string;
  excludeFieldMetadataIds?: string[];
  excludeCreatedAtAndUpdatedAt?: boolean;
  showRelationSections?: boolean;
};

export const useFieldListFieldMetadataItems = ({
  objectNameSingular,
  excludeFieldMetadataIds = [],
  showRelationSections = true,
  excludeCreatedAtAndUpdatedAt = true,
}: UseFieldListFieldMetadataItemsProps) => {
  const { labelIdentifierFieldMetadataItem } =
    useLabelIdentifierFieldMetadataItem({
      objectNameSingular,
    });

  const { objectPermissionsByObjectMetadataId } = useObjectPermissions();

  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const { objectMetadataItems } = useObjectMetadataItems();

  // Get custom order for this object type
  const customOrder = CUSTOM_FIELD_ORDER[objectNameSingular];

  const isJunctionRelationsEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IS_JUNCTION_RELATIONS_ENABLED,
  );

  const availableFieldMetadataItems = objectMetadataItem.readableFields
    .filter(
      (fieldMetadataItem) =>
        isFieldCellSupported(fieldMetadataItem, objectMetadataItems) &&
        fieldMetadataItem.id !== labelIdentifierFieldMetadataItem?.id &&
        !excludeFieldMetadataIds.includes(fieldMetadataItem.id) &&
        (!excludeCreatedAtAndUpdatedAt ||
          (fieldMetadataItem.name !== 'createdAt' &&
            fieldMetadataItem.name !== 'deletedAt')) &&
        (showRelationSections ||
          (fieldMetadataItem.type !== FieldMetadataType.RELATION &&
            fieldMetadataItem.type !== FieldMetadataType.MORPH_RELATION)),
    )
    .sort((fieldMetadataItemA, fieldMetadataItemB) => {
      // Use custom order if defined for this object
      if (customOrder) {
        const posA = customOrder.indexOf(fieldMetadataItemA.name);
        const posB = customOrder.indexOf(fieldMetadataItemB.name);
        // Fields not in custom order go to the end, sorted alphabetically
        const orderA = posA !== -1 ? posA : 999;
        const orderB = posB !== -1 ? posB : 999;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        // If both are not in custom order (both 999), sort alphabetically
        if (orderA === 999 && orderB === 999) {
          return fieldMetadataItemA.name.localeCompare(fieldMetadataItemB.name);
        }
        return 0;
      }
      // Fall back to alphabetical sort
      return fieldMetadataItemA.name.localeCompare(fieldMetadataItemB.name);
    });

  const { inlineFieldMetadataItems, relationFieldMetadataItems } = groupBy(
    availableFieldMetadataItems
      .filter(
        (fieldMetadataItem) =>
          fieldMetadataItem.name !== 'createdAt' &&
          fieldMetadataItem.name !== 'deletedAt',
      )
      .filter(
        (fieldMetadataItem) =>
          fieldMetadataItem.type !== FieldMetadataType.RICH_TEXT_V2,
      ),
    (fieldMetadataItem) =>
      fieldMetadataItem.type === FieldMetadataType.RELATION ||
      fieldMetadataItem.type === FieldMetadataType.MORPH_RELATION
        ? 'relationFieldMetadataItems'
        : 'inlineFieldMetadataItems',
  );

  const { activityTargetFields, inlineRelationFields, boxedRelationFields } =
    categorizeRelationFields({
      relationFields: relationFieldMetadataItems ?? [],
      objectNameSingular,
      objectPermissionsByObjectMetadataId,
      isJunctionRelationsEnabled,
    });

  const allInlineFieldMetadataItems = [
    ...(inlineFieldMetadataItems ?? []),
    ...inlineRelationFields,
  ].sort((a, b) => a.name.localeCompare(b.name));

  return {
    inlineFieldMetadataItems: allInlineFieldMetadataItems,
    legacyActivityTargetFieldMetadataItems: activityTargetFields,
    boxedRelationFieldMetadataItems: boxedRelationFields,
  };
};
