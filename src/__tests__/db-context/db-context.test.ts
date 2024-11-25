import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';

import { DbContext } from '~core/application/db-context/db-context.interface';
import { User } from '~modules/user/domain/entities/user.entity';

import { DrizzleDbContextFactory } from './helpers/drizzle-db-context.factory';
import { PrismaDbContextFactory } from './helpers/prisma-db-context.factory';
import { SequelizeDbContextFactory } from './helpers/sequelize-db-context.factory';

describe.each([
  { factory: new DrizzleDbContextFactory() },
  { factory: new PrismaDbContextFactory() },
  { factory: new SequelizeDbContextFactory() },
])('DbContext + user repository', ({ factory }) => {
  let postgresContainer: StartedPostgreSqlContainer;
  let dbContext: DbContext;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start();

    dbContext = await factory.create({
      connectionString: postgresContainer.getConnectionUri(),
    });

    await factory.migrate();
  });

  it('should insert', async () => {
    await dbContext.startTransaction();
    const user = new User('John Doe', 'john.doe@example.com', 20);
    const savedUser = await dbContext.userRepository.save(user);
    expect(savedUser.id).toBeDefined();

    const userFromDb = await dbContext.userRepository.findById(savedUser.id);
    expect(userFromDb).toEqual(expect.objectContaining(user));
    await dbContext.commitTransaction();
  });

  it('should update', async () => {
    await dbContext.startTransaction();
    const user = new User('John Doe', 'john.doe@example.com', 20);
    const savedUser = await dbContext.userRepository.save(user);
    expect(savedUser.id).toBeDefined();

    savedUser.age = 21;
    const updatedUser = await dbContext.userRepository.save(savedUser);
    expect(updatedUser.age).toBe(21);
    await dbContext.commitTransaction();
  });

  it('should delete', async () => {
    await dbContext.startTransaction();
    const user = new User('John Doe', 'john.doe@example.com', 20);
    const savedUser = await dbContext.userRepository.save(user);
    expect(savedUser.id).toBeDefined();

    await dbContext.userRepository.delete(savedUser.id);
    const userFromDb = await dbContext.userRepository.findById(savedUser.id);

    expect(userFromDb).toBeNull();
    await dbContext.commitTransaction();
  });

  it('should find all', async () => {
    await dbContext.startTransaction();
    const user = new User('John Doe', 'john.doe@example.com', 20);

    await dbContext.userRepository.save(user);

    const users = await dbContext.userRepository.findAll();
    expect(users).toHaveLength(1);
    await dbContext.commitTransaction();
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

    await dbContext.commitTransaction();
  });

  afterEach(async () => {
    try {
      await dbContext.rollbackTransaction();
    } catch (error) {}
    await factory.close();
    dbContext = await factory.create({
      connectionString: postgresContainer.getConnectionUri(),
    });
    await dbContext.startTransaction();
    const users = await dbContext.userRepository.findAll();
    await Promise.all(users.map((user) => dbContext.userRepository.delete(user.id)));
    await dbContext.commitTransaction();
  });

  afterAll(async () => {
    await factory.close();
    await postgresContainer.stop();
  });
});
