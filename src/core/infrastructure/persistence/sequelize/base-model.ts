import { Model } from 'sequelize-typescript';

export interface WithNumberKeySignature {
  [key: number]: unknown;
}

export interface WithSymbolKeySignature {
  [key: symbol]: unknown;
}

// this work around is needed because of the way sequelize handles the model upsert type as
export abstract class BaseModel extends Model implements WithNumberKeySignature, WithSymbolKeySignature {
  [key: number]: unknown;
  [key: symbol]: unknown;
}
