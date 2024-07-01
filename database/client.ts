import { Client } from 'pg'

export const connectDatabaseClient = async () => {
    const client = new Client({ database: 'postgres' });
    await client.connect();
    return client;
}