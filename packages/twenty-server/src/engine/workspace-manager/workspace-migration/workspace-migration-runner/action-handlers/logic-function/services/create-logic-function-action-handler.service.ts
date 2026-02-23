import { Injectable } from '@nestjs/common';

<<<<<<< HEAD
import { v4 } from 'uuid';

import { WorkspaceMigrationRunnerActionHandler } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/interfaces/workspace-migration-runner-action-handler-service.interface';

import { getUniversalFlatEntityEmptyForeignKeyAggregators } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/utils/reset-universal-flat-entity-foreign-key-aggregators.util';
import {
  FlatCreateLogicFunctionAction,
  UniversalCreateLogicFunctionAction,
} from 'src/engine/workspace-manager/workspace-migration/workspace-migration-builder/builders/logic-function/types/workspace-migration-logic-function-action.type';
=======
import { FileFolder } from 'twenty-shared/types';

import { WorkspaceMigrationRunnerActionHandler } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/interfaces/workspace-migration-runner-action-handler-service.interface';

import { FileStorageService } from 'src/engine/core-modules/file-storage/file-storage.service';
import { LogicFunctionEntity } from 'src/engine/metadata-modules/logic-function/logic-function.entity';
import {
  LogicFunctionException,
  LogicFunctionExceptionCode,
} from 'src/engine/metadata-modules/logic-function/logic-function.exception';
import { FlatCreateLogicFunctionAction } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-builder/builders/logic-function/types/workspace-migration-logic-function-action.type';
>>>>>>> hevea-local
import {
  WorkspaceMigrationActionRunnerArgs,
  WorkspaceMigrationActionRunnerContext,
} from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/types/workspace-migration-action-runner-args.type';

@Injectable()
export class CreateLogicFunctionActionHandlerService extends WorkspaceMigrationRunnerActionHandler(
  'create',
  'logicFunction',
) {
<<<<<<< HEAD
  override async transpileUniversalActionToFlatAction({
    action,
    flatApplication,
    workspaceId,
  }: WorkspaceMigrationActionRunnerArgs<UniversalCreateLogicFunctionAction>): Promise<FlatCreateLogicFunctionAction> {
    const emptyUniversalForeignKeyAggregators =
      getUniversalFlatEntityEmptyForeignKeyAggregators({
        metadataName: 'logicFunction',
      });

    return {
      ...action,
      flatEntity: {
        ...action.flatEntity,
        applicationId: flatApplication.id,
        id: action.id ?? v4(),
        workspaceId,
        ...emptyUniversalForeignKeyAggregators,
      },
    };
=======
  constructor(private readonly fileStorageService: FileStorageService) {
    super();
  }

  override async transpileUniversalActionToFlatAction(
    context: WorkspaceMigrationActionRunnerArgs<FlatCreateLogicFunctionAction>,
  ): Promise<FlatCreateLogicFunctionAction> {
    return context.action;
>>>>>>> hevea-local
  }

  async executeForMetadata(
    context: WorkspaceMigrationActionRunnerContext<FlatCreateLogicFunctionAction>,
  ): Promise<void> {
    const { flatAction, queryRunner } = context;
    const { flatEntity: logicFunction } = flatAction;

    await this.insertFlatEntitiesInRepository({
      queryRunner,
      flatEntities: [logicFunction],
    });
  }

  async rollbackForMetadata(
    _context: Omit<
      WorkspaceMigrationActionRunnerArgs<FlatCreateLogicFunctionAction>,
      'queryRunner'
    >,
  ): Promise<void> {
    // Nothing to rollback for now
    return;
  }
}
