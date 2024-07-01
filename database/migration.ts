import { Client } from 'pg'
import { readFileSync } from 'fs'
import { getSeedQuery } from './seed';

const schema = readFileSync('database/schema.sql', { encoding: 'utf8' });

const migrate = async () => {
    const client = new Client({ database: 'postgres' });
    await client.connect();

    const seedQuery = getSeedQuery();
    await client.query(`${schema}${seedQuery}`);
    await client.end();
}

migrate();