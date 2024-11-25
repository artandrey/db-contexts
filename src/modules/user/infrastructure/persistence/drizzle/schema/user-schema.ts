import { integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { UserId } from '~modules/user/domain/entities/user.entity';

export const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom().$type<UserId>(),
  name: text().notNull(),
  email: text().notNull(),
  age: integer().notNull(),
});
