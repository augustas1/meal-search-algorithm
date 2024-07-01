import { connectDatabaseClient } from "./database/client";
import format from 'pg-format';

export const extractEntities = async (searchTerm: string) => {
    const client = await connectDatabaseClient();
    const words = searchTerm.split(' ').filter(word => !['in', 'or'].includes(word));
    const wordsRegex = `(${words.join('|')})`

    const selects = Object.entries(tableToEntityMap).map(([table, entity]) =>
        format("SELECT id, name, (regexp_match(name, %L, 'i'))[1] as word, %L as type FROM %I WHERE name ~* %L", wordsRegex, entity, table, wordsRegex));

    const query = selects.join(' UNION ');
    const results = await client.query(query)

    await client.end();
    const combinations = getCombinations(results.rows);
    return mapResultObjects(combinations);
};

const getCombinations = (entities: MatchedEntity[]) => {
    const groupedEntities = groupEntities(entities);
    const multiMatch = getMultiMatchedEntities(groupedEntities);
    const singleMatchedEntities = getSingleMatchedEntities(entities, multiMatch);

    return multiMatch.length > 0
        ? multiMatch.map(multiMatchedEntity => [multiMatchedEntity, ...singleMatchedEntities])
        : [singleMatchedEntities];
};

const groupEntities = (entities: MatchedEntity[]) => {
    return entities.reduce<GroupedEntities>((grouped, entity) => {
        const { entityTypeMap, wordMap } = grouped;

        if (entityTypeMap[entity.type]) {
            entityTypeMap[entity.type].push(entity);
        } else {
            entityTypeMap[entity.type] = [entity];
        }

        if (wordMap[entity.word]) {
            wordMap[entity.word].push(entity);
        } else {
            wordMap[entity.word] = [entity];
        }


        return grouped;
    }, { entityTypeMap: {}, wordMap: {} });
};

const getMultiMatchedEntities = (groupedEntities: GroupedEntities) => {
    for (const entityTypeGroup of Object.values(groupedEntities.entityTypeMap)) {
        if (entityTypeGroup.length > 1) {
            return entityTypeGroup;
        }
    }

    for (const wordMatchGroup of Object.values(groupedEntities.wordMap)) {
        if (wordMatchGroup.length > 1) {
            return wordMatchGroup;
        }
    }

    return [];
};

const getSingleMatchedEntities = (entities: MatchedEntity[], multiMatch: MatchedEntity[]) => {
    return entities.filter(entity => {
        for (const multiMatchedEntity of multiMatch) {
            if (multiMatchedEntity.word === entity.word && multiMatchedEntity.type === entity.type) {
                return false;
            }
        }

        return true;
    });
};

const mapResultObjects = (combinations: MatchedEntity[][]) => {
    return combinations.map(combination => {
        return combination.reduce<ResultObject>((resultObject, { id, name, type }) => {
            resultObject[type] = { id, name };
            return resultObject;
        }, {});
    })
};

const tableToEntityMap: Record<string, string> = {
    'brands': 'brand',
    'cities': 'city',
    'diets': 'diet',
    'dish_types': 'dishType',
};

interface MatchedEntity {
    id: number;
    name: string;
    type: string;
    word: string;
};

interface GroupedEntities {
    entityTypeMap: EntityMap,
    wordMap: EntityMap;
};

type EntityMap = { [key: string]: MatchedEntity[] };
type ResultObject = { [key: string]: { id: number; name: string; } };