import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import format from 'pg-format';

export const getSeedQuery = () => {
    const insertStatements = Object.entries(tableToSeedFileMap).map(([table, file]) => {
        const data = readFileSync(file, { encoding: 'utf-8' });
        const rows = parse(data, { from: 2 });
        return format('INSERT INTO %I (id, name) VALUES %L ON CONFLICT DO NOTHING', table, rows);
    });

    return insertStatements.join(';');
}

const seedDirectory = 'database/seed/';

const tableToSeedFileMap: Record<string, string> = {
    'brands': `${seedDirectory}/brands.csv`,
    'cities': `${seedDirectory}/cities.csv`,
    'diets': `${seedDirectory}/diets.csv`,
    'dish_types': `${seedDirectory}/dish-types.csv`,
};
