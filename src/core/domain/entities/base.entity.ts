export abstract class BaseEntity<TId> {
  public readonly id!: TId;
  constructor(id?: TId) {
    if (id) {
      this.id = id;
    }
  }

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
