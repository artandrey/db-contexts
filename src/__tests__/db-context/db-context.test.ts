import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import path from 'path';
import { Client } from 'pg';

import { DrizzleDbContext } from '~core/infrastructure/persistence/drizzle/drizzle-db-context';
import * as schema from '~core/infrastructure/persistence/drizzle/schema';
import { User } from '~modules/user/domain/entities/user.entity';

describe('DbContext + user repository', () => {
  let postgresContainer: StartedPostgreSqlContainer;
  let dbContext: DrizzleDbContext;
  let client: Client;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start();

    client = new Client({
      connectionString: postgresContainer.getConnectionUri(),
    });
    await client.connect();
    const db = drizzle(client, { schema });

    await migrate(db, {
      migrationsFolder: path.join(process.cwd(), 'migrations/drizzle'),
    });

    dbContext = new DrizzleDbContext(db);
  });

  it('should insert', async () => {
    const user = new User('John Doe', 'john.doe@example.com', 20);
    const savedUser = await dbContext.userRepository.save(user);
    expect(savedUser.id).toBeDefined();

    const userFromDb = await dbContext.userRepository.findById(savedUser.id);
    expect(userFromDb).toEqual(expect.objectContaining(user));
  });

  it('should delete', async () => {
    const user = new User('John Doe', 'john.doe@example.com', 20);
    const savedUser = await dbContext.userRepository.save(user);
    expect(savedUser.id).toBeDefined();

    await dbContext.userRepository.delete(savedUser.id);
    const userFromDb = await dbContext.userRepository.findById(savedUser.id);

    expect(userFromDb).toBeNull();
  });

  it('should find all', async () => {
    const user = new User('John Doe', 'john.doe@example.com', 20);

    await dbContext.userRepository.save(user);

    const users = await dbContext.userRepository.findAll();
    expect(users).toHaveLength(1);
  });

  it('should rollback', async () => {
    await dbContext.startTransaction();
    const user = new User('John Doe', 'john.doe@example.com', 20);
    const result = await dbContext.userRepository.save(user);
    expect(result.id).toBeDefined();
    await dbContext.rollbackTransaction();

    const userFromDb = await dbContext.userRepository.findById(result.id);
    expect(userFromDb).toBeNull();
  });

  it('should commit', async () => {
    await dbContext.startTransaction();

    const user = new User('John Doe', 'john.doe@example.com', 20);
    const result = await dbContext.userRepository.save(user);
    expect(result.id).toBeDefined();

    await dbContext.commitTransaction();

    const userFromDb = await dbContext.userRepository.findById(result.id);
    expect(userFromDb).toEqual(expect.objectContaining(user));
  });

  it('should throw error when commit without transaction', async () => {
    await expect(dbContext.commitTransaction()).rejects.toThrow();
  });

  it('should throw error when rollback without transaction', async () => {
    await expect(dbContext.rollbackTransaction()).rejects.toThrow();
  });

  it('should throw when start transaction twice', async () => {
    await dbContext.startTransaction();

    await expect(dbContext.startTransaction()).rejects.toThrow();
  });

  afterEach(async () => {
    const users = await dbContext.userRepository.findAll();
    await Promise.all(users.map((user) => dbContext.userRepository.delete(user.id)));
  });

  afterAll(async () => {
    await client.end();
    await postgresContainer.stop();
  });
});
