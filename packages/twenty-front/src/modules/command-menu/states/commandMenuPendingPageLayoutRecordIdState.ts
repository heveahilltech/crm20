import { createState } from 'twenty-ui/utilities';

export const commandMenuPendingPageLayoutRecordIdState = createState<
  string | null
>({
  key: 'command-menu/commandMenuPendingPageLayoutRecordIdState',
  defaultValue: null,
});
