import { Injectable } from '@nestjs/common';

import { WorkspaceMigrationRunnerActionHandler } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/interfaces/workspace-migration-runner-action-handler-service.interface';

<<<<<<< HEAD
import { getUniversalFlatEntityEmptyForeignKeyAggregators } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/utils/reset-universal-flat-entity-foreign-key-aggregators.util';
import {
  FlatCreateRoleAction,
  UniversalCreateRoleAction,
} from 'src/engine/workspace-manager/workspace-migration/workspace-migration-builder/builders/role/types/workspace-migration-role-action.type';
=======
import { RoleEntity } from 'src/engine/metadata-modules/role/role.entity';
import { FlatCreateRoleAction } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-builder/builders/role/types/workspace-migration-role-action.type';
>>>>>>> hevea-local
import {
  WorkspaceMigrationActionRunnerArgs,
  WorkspaceMigrationActionRunnerContext,
} from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/types/workspace-migration-action-runner-args.type';

@Injectable()
export class CreateRoleActionHandlerService extends WorkspaceMigrationRunnerActionHandler(
  'create',
  'role',
) {
  constructor() {
    super();
  }

<<<<<<< HEAD
  override async transpileUniversalActionToFlatAction({
    action,
    flatApplication,
    workspaceId,
  }: WorkspaceMigrationActionRunnerArgs<UniversalCreateRoleAction>): Promise<FlatCreateRoleAction> {
    const emptyUniversalForeignKeyAggregators =
      getUniversalFlatEntityEmptyForeignKeyAggregators({
        metadataName: 'role',
      });

    return {
      ...action,
      flatEntity: {
        ...action.flatEntity,
        applicationId: flatApplication.id,
        id: action.id ?? v4(),
        workspaceId,
        roleTargetIds: [],
        rowLevelPermissionPredicateIds: [],
        rowLevelPermissionPredicateGroupIds: [],
        objectPermissionIds: [],
        permissionFlagIds: [],
        fieldPermissionIds: [],
        ...emptyUniversalForeignKeyAggregators,
      },
    };
=======
  override async transpileUniversalActionToFlatAction(
    context: WorkspaceMigrationActionRunnerArgs<FlatCreateRoleAction>,
  ): Promise<FlatCreateRoleAction> {
    return context.action;
>>>>>>> hevea-local
  }

  async executeForMetadata(
    context: WorkspaceMigrationActionRunnerContext<FlatCreateRoleAction>,
  ): Promise<void> {
    const { flatAction, queryRunner } = context;
    const { flatEntity } = flatAction;

    await this.insertFlatEntitiesInRepository({
      queryRunner,
      flatEntities: [flatEntity],
    });
  }

  async executeForWorkspaceSchema(
    _context: WorkspaceMigrationActionRunnerContext<FlatCreateRoleAction>,
  ): Promise<void> {
    return;
  }
}
