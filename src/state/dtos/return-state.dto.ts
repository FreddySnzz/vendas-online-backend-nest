import { StateEntity } from "../entities/state.entity";

export class ReturnStateDto {
  id: number;
  name: string;
  uf: string;

  constructor (state: StateEntity) {
    this.id = state.id;
    this.name = state.name;
    this.uf = state.uf;
  };
}