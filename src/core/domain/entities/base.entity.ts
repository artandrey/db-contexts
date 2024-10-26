export abstract class BaseEntity<TId> {
  constructor(public readonly id: TId) {}

  equals(entity: BaseEntity<TId>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }
    if (!entity.id || !this.id) {
      return false;
    }

    return entity.id === this.id;
  }
}
