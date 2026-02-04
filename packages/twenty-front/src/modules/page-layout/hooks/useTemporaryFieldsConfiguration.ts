import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
// import { Fields } from '@/object-record/object-options-dropdown/components/__stories__/ObjectOptionsDropdownContent.stories';
import { type FieldsConfiguration } from '@/page-layout/types/FieldsConfiguration';
import { useLingui } from '@lingui/react/macro';
import { useMemo } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { FieldMetadataType } from '~/generated-metadata/graphql';

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

export const useTemporaryFieldsConfiguration = (
  objectNameSingular: string,
): FieldsConfiguration | null => {
  const { t } = useLingui();
  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const configuration = useMemo<FieldsConfiguration | null>(() => {
    if (!isDefined(objectMetadataItem)) {
      return null;
    }

    let fieldsToDisplay = objectMetadataItem.fields.filter(
      (field) =>
        field.type !== FieldMetadataType.RELATION &&
        field.type !== FieldMetadataType.MORPH_RELATION &&
        field.type !== FieldMetadataType.RICH_TEXT_V2,
    );

    // Get custom order for this object type
    const customOrder = CUSTOM_FIELD_ORDER[objectNameSingular];
    
    // First, create intermediate array with positions for sorting
    const fieldsWithPositions = fieldsToDisplay.map((field) => {
      let position: number;
      
      if (customOrder) {
        // Use custom order if defined for this object
        const customPosition = customOrder.indexOf(field.name);
        position = customPosition !== -1 ? customPosition : 999; // Put unspecified fields at end
      } else {
        // Fall back to default order
        position = fieldsToDisplay.indexOf(field);
      }
      
      return {
        fieldMetadataId: field.id,
        fieldName: field.name,
        position,
      };
    });

    // Sort by position
    fieldsWithPositions.sort((a, b) => a.position - b.position);
    // Create final fields array with sequential positions
    const fields = fieldsWithPositions.map((field, index) => ({
      fieldMetadataId: field.fieldMetadataId,
      position: index,
    }));


    if (fields.length === 0) {
      return null;
    }

    return {
      __typename: 'FieldsConfiguration',
      configurationType: 'FIELDS',
      sections: [
      {
          id: `${objectNameSingular}-section-general`,
          title: t`General`,
          position: 0,
          fields,
        },
      ],
    };
  }, [objectMetadataItem, objectNameSingular, t]);

  return configuration;
};
