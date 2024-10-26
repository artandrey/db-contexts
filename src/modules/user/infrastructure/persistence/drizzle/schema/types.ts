import { users } from './user-schema';

export type UserPersistence = typeof users.$inferSelect;
