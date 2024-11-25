import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { User, UserId } from '~modules/user/domain/entities/user.entity';
import { UserRepository } from '~modules/user/domain/repositories/user.repository';

import { DrizzleUserMapper } from '../mappers/drizzle-user.mapper';
import { users } from '../schema';
import * as userSchema from '../schema';

export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly db: NodePgDatabase<typeof userSchema>) {}

  async findAll(): Promise<User[]> {
    const users = await this.db.query.users.findMany();
    return users.map(DrizzleUserMapper.toDomain);
  }

  async findById(id: UserId): Promise<User | null> {
    const user = await this.db.query.users.findFirst({ where: eq(users.id, id) });
    return user ? DrizzleUserMapper.toDomain(user) : null;
  }

  async save(user: User): Promise<User> {
    const persistence = DrizzleUserMapper.toPersistence(user);
    const [savedUser] = await this.db
      .insert(users)
      .values(persistence)
      .onConflictDoUpdate({
        target: [users.id],
        set: persistence,
      })
      .returning();
    return DrizzleUserMapper.toDomain(savedUser);
  }

  async delete(id: UserId): Promise<void> {
    await this.db.delete(users).where(eq(users.id, id));
  }
}
