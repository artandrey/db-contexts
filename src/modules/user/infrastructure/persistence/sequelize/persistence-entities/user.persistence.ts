import { randomUUID } from 'crypto';
import { Column, DataType, PrimaryKey, Table } from 'sequelize-typescript';

import { BaseModel } from '~core/infrastructure/persistence/sequelize/base-model';
import { UserId } from '~modules/user/domain/entities/user.entity';

@Table({ tableName: 'users' })
export class UserPersistenceEntity extends BaseModel {
  @PrimaryKey
  @Column({ type: DataType.UUID, primaryKey: true })
  id: UserId = randomUUID() as UserId;

  @Column({ type: DataType.STRING })
  email!: string;

  @Column({ type: DataType.STRING })
  name!: string;

  @Column({ type: DataType.INTEGER })
  age!: number;
}
