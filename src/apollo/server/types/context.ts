import { IConfig } from '@server/config';
import {
  IIbisAdaptor,
  IWrenAIAdaptor,
  IWrenEngineAdaptor,
} from '@server/adaptors';
import {
  IApiHistoryRepository,
  IDashboardItemRefreshJobRepository,
  IDashboardItemRepository,
  IDashboardRepository,
  IDeployLogRepository,
  IInstructionRepository,
  ILearningRepository,
  IModelColumnRepository,
  IModelNestedColumnRepository,
  IModelRepository,
  IProjectRepository,
  IRelationRepository,
  ISchemaChangeRepository,
  ISqlPairRepository,
  IViewRepository,
} from '@server/repositories';
import {
  IAskingService,
  IDashboardService,
  IDeployService,
  IInstructionService,
  IMDLService,
  IModelService,
  IProjectService,
  IQueryService,
} from '@server/services';
import { ITelemetry } from '@server/telemetry/telemetry';
import {
  DashboardCacheBackgroundTracker,
  ProjectRecommendQuestionBackgroundTracker,
  ThreadRecommendQuestionBackgroundTracker,
} from '@server/backgrounds';
import { ISqlPairService } from '../services/sqlPairService';

export interface IContext {
  config: IConfig;
  // telemetry
  telemetry: ITelemetry;

  // adaptor
  wrenEngineAdaptor: IWrenEngineAdaptor;
  ibisServerAdaptor: IIbisAdaptor;
  wrenAIAdaptor: IWrenAIAdaptor;

  // services
  projectService: IProjectService;
  modelService: IModelService;
  mdlService: IMDLService;
  deployService: IDeployService;
  askingService: IAskingService;
  queryService: IQueryService;
  dashboardService: IDashboardService;
  sqlPairService: ISqlPairService;
  instructionService: IInstructionService;

  // repository
  projectRepository: IProjectRepository;
  modelRepository: IModelRepository;
  modelColumnRepository: IModelColumnRepository;
  modelNestedColumnRepository: IModelNestedColumnRepository;
  relationRepository: IRelationRepository;
  viewRepository: IViewRepository;
  deployRepository: IDeployLogRepository;
  schemaChangeRepository: ISchemaChangeRepository;
  learningRepository: ILearningRepository;
  dashboardRepository: IDashboardRepository;
  dashboardItemRepository: IDashboardItemRepository;
  sqlPairRepository: ISqlPairRepository;
  instructionRepository: IInstructionRepository;
  apiHistoryRepository: IApiHistoryRepository;
  dashboardItemRefreshJobRepository: IDashboardItemRefreshJobRepository;

  // background trackers
  projectRecommendQuestionBackgroundTracker: ProjectRecommendQuestionBackgroundTracker;
  threadRecommendQuestionBackgroundTracker: ThreadRecommendQuestionBackgroundTracker;
  dashboardCacheBackgroundTracker: DashboardCacheBackgroundTracker;
}
