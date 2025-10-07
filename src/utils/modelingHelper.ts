import { keyBy } from 'lodash';
import { Diagram, DiagramModel } from '@/utils/data/type';
import { getFieldValue } from '@/components/selectors/lineageSelector/FieldSelect';

export const editCalculatedField = (
  payload: { diagramData: Diagram; data: any },
  openCalculatedFieldModal: (defaultValue: any, payload: any) => void,
) => {
  const { diagramData, data } = payload;
  const sourceModel = diagramData.models.find(
    (model) => model?.modelId === data.modelId,
  );

  const getField = (model: DiagramModel, columnId: number) => {
    return [...(model?.fields || []), ...(model?.calculatedFields || [])].find(
      (field) => field?.columnId === columnId,
    );
  };

  // Retrieve from the source model directly if only one id in lineage
  const isSourceModelField = data.lineage.length === 1;
  if (isSourceModelField) {
    const field = getField(sourceModel as DiagramModel, data.lineage[0]);
    openCalculatedFieldModal &&
      openCalculatedFieldModal(
        {
          columnId: data.columnId,
          name: data.displayName,
          expression: data.aggregation,
          lineage: [getFieldValue(field)],
        },
        {
          models: diagramData.models,
          sourceModel: sourceModel || undefined,
        },
      );
    return;
  }

  // Otherwise, retrieve all relations and column by their id
  const allModelsMap = keyBy(diagramData.models, 'referenceName');
  const relationIds = [...data.lineage];
  const lastColumnId = relationIds.pop(); // it will also remove the last column id from relationIds

  let nextModel: any = null;
  const relations = relationIds.reduce((result: any[], relationId: any) => {
    const relation = (nextModel || sourceModel)?.relationFields?.find(
      (relation: any) => relation?.relationId === relationId,
    );
    if (relation) {
      nextModel = allModelsMap[relation.referenceName];
      return [...result, relation];
    }
    return result;
  }, []);

  const lastRelation = relations[relations.length - 1];
  const lastModel = lastRelation
    ? allModelsMap[lastRelation.referenceName]
    : null;
  const field = lastModel ? getField(lastModel, lastColumnId) : null;

  openCalculatedFieldModal &&
    openCalculatedFieldModal(
      {
        columnId: data.columnId,
        name: data.displayName,
        expression: data.aggregation,
        lineage: [...relations, field].filter(Boolean).map(getFieldValue),
      },
      {
        models: diagramData.models,
        sourceModel,
      },
    );
};
