import { PrismaDataSource } from '~core/infrastructure/persistence/prisma/prisma-db-context';
import { User, UserId } from '~modules/user/domain/entities/user.entity';
import { UserRepository } from '~modules/user/domain/repositories/user.repository';

import { PrismaUserMapper } from '../mappers/prisma-user.mapper';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaDataSource) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(PrismaUserMapper.toDomain);
  }

  async findById(id: UserId): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  async save(user: User): Promise<User> {
    const persistence = PrismaUserMapper.toPersistence(user);

    if (!persistence.id) {
      const createdUser = await this.prisma.user.create({
        data: persistence,
      });
      return PrismaUserMapper.toDomain(createdUser);
    }

    const savedUser = await this.prisma.user.upsert({
      where: { id: persistence.id },
      create: persistence,
      update: persistence,
    });
    return PrismaUserMapper.toDomain(savedUser);
  }

  async delete(id: UserId): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
