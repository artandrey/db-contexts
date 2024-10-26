import { UserRepository } from '~modules/user/domain/repositories/user.repository';

export interface DbContext {
  startTransaction(): Promise<void>;

  commitTransaction(): Promise<void>;

  rollbackTransaction(): Promise<void>;

  readonly userRepository: UserRepository;
}
