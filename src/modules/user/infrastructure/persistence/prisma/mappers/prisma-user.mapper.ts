import { User as PrismaUser } from '@prisma/client';

import { User, UserId } from '~modules/user/domain/entities/user.entity';

export class PrismaUserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return new User(prismaUser.name, prismaUser.email, prismaUser.age, prismaUser.id as UserId);
  }

  static toPersistence(user: User): PrismaUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
    };
  }
}
