import { readFileSync } from 'fs'
import { getSeedQuery } from './seed';
import { connectDatabaseClient } from './client';

const schema = readFileSync('database/schema.sql', { encoding: 'utf8' });

const migrate = async () => {
    const client = await connectDatabaseClient();

    const seedQuery = getSeedQuery();
    await client.query(`${schema}${seedQuery}`);
    await client.end();
}

migrate();