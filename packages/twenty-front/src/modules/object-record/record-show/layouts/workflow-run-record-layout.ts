import { CardType } from '@/object-record/record-show/types/CardType';
import { type RecordLayout } from '@/object-record/record-show/types/RecordLayout';

export const WORKFLOW_RUN_RECORD_LAYOUT: RecordLayout = {
  tabs: {
    fields: {
      title: 'Home',
      icon: 'IconList',
      position: 100,
      cards: [{ type: CardType.FieldCard }],
      hide: {
        ifMobile: false,
        ifDesktop: true,
        ifInRightDrawer: false,
        ifFeaturesDisabled: [],
        ifRequiredObjectsInactive: [],
        ifRelationsMissing: [],
      },
    },
    workflowRun: {
      title: 'Flow',
      position: 101,
      icon: 'IconSettings',
      cards: [{ type: CardType.WorkflowRunCard }],
      hide: {
        ifMobile: false,
        ifDesktop: false,
        ifInRightDrawer: false,
        ifFeaturesDisabled: [],
        ifRequiredObjectsInactive: [],
        ifRelationsMissing: [],
      },
    },
    timeline: null,
    tasks: null,
    notes: null,
    files: null,
  },
};
