import { User, UserId } from '~modules/user/domain/entities/user.entity';

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: UserId): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: UserId): Promise<void>;
}
