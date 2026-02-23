<<<<<<< HEAD
import {
  type FieldsConfiguration,
  WidgetConfigurationType,
} from '~/generated-metadata/graphql';
=======
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
// import { Fields } from '@/object-record/object-options-dropdown/components/__stories__/ObjectOptionsDropdownContent.stories';
import { type FieldsConfiguration } from '@/page-layout/types/FieldsConfiguration';
import { useLingui } from '@lingui/react/macro';
import { useMemo } from 'react';
import { isDefined } from 'twenty-shared/utils';
>>>>>>> hevea-local

export const useTemporaryFieldsConfiguration = (): FieldsConfiguration => {
  return {
    __typename: 'FieldsConfiguration',
    configurationType: WidgetConfigurationType.FIELDS,
    viewId: null,
  };
};
