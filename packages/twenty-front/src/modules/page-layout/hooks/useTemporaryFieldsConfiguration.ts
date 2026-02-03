import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { type FieldsConfiguration } from '@/page-layout/types/FieldsConfiguration';
import { useLingui } from '@lingui/react/macro';
import { useMemo } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { FieldMetadataType } from '~/generated-metadata/graphql';
import { useFieldOrderByObject } from './useFieldOrderByObject';

export const useTemporaryFieldsConfiguration = (
  objectNameSingular: string,
): FieldsConfiguration | null => {
  const { t } = useLingui();
  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const fieldOrderByObject = useFieldOrderByObject();

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

    const order=
      fieldOrderByObject?.[objectNameSingular] ??
      fieldOrderByObject?.[objectNameSingular.toLowerCase()];
    const debug =
      typeof import.meta !== 'undefined' &&
      (import.meta as unknown as { env?: { VITE_DEBUG_FIELD_ORDER?: string } })?.env
        ?.VITE_DEBUG_FIELD_ORDER === 'true';
      if (debug) {
        const keys = fieldOrderByObject ? Object.keys(fieldOrderByObject) : [];
        console.log(
          '[field-order] objectNameSingular=',
          objectNameSingular,
          '| order found=', !!order,'| available keys=', keys.slice(0, 8).join(', '));
      }
    if (order?.length) {
      fieldsToDisplay = [...fieldsToDisplay].sort((a, b) => {
        const indexA = order.indexOf(a.name);
        const indexB = order.indexOf(b.name);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
      if (debug) {
        console.log(
          '[field-order] ordered fields:',
          fieldsToDisplay.map((f) => f.name).slice(0, 10).join(', '),
        );
      }
    }

    const fields = fieldsToDisplay.map((field, index) => ({
      fieldMetadataId: field.id,
      position: index,
    }));

    if (fieldsToDisplay.length === 0) {
      return null;
    }

    const generalFields: Array<{ fieldMetadataId: string; position: number }> =
      [];
    const otherFields: Array<{ fieldMetadataId: string; position: number }> =
      [];

    let generalPosition = 0;
    let otherPosition = 0;

    fieldsToDisplay.forEach((field) => {
      if (field.isCustom === true) {
        otherFields.push({
          fieldMetadataId: field.id,
          position: otherPosition++,
        });
      } else {
        generalFields.push({
          fieldMetadataId: field.id,
          position: generalPosition++,
        });
      }
    });

    const sections = [];

    if (generalFields.length > 0) {
      sections.push({
        id: `${objectNameSingular}-section-general`,
        title: t`General`,
        position: 0,
        fields: generalFields,
      });
    }

    if (otherFields.length > 0) {
      sections.push({
        id: `${objectNameSingular}-section-other`,
        title: t`Other`,
        position: 1,
        fields: otherFields,
      });
    }

    if (sections.length === 0) {
      return null;
    }

    return {
      __typename: 'FieldsConfiguration',
      configurationType: 'FIELDS',
      sections,
    };
  }, [objectMetadataItem, objectNameSingular, fieldOrderByObject, t]);

  return configuration;
};
