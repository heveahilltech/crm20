import { createAtomState } from '@/ui/utilities/state/jotai/utils/createAtomState';

export const isAdvancedModeEnabledState = createAtomState<boolean>({
  key: 'isAdvancedModeEnabledAtom',
  defaultValue: true,
});
