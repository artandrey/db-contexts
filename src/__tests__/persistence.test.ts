import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';

describe('Infrastructure setup test', () => {
  let postgresContainer: StartedPostgreSqlContainer;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start();
  });

  it('should connect to the database', async () => {
    const client = new Client({
      connectionString: postgresContainer.getConnectionUri(),
    });

    await client.connect();

    const result = await client.query('SELECT 1');
    expect(result.rows[0]).toEqual({ '?column?': 1 });
    client.end();
  });

  afterAll(async () => {
    await postgresContainer.stop();
  });
});
