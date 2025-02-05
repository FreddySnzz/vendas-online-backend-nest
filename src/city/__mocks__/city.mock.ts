import { CityEntity } from "../entities/city.entity";
import { stateMock } from "../../state/__mocks__/state.mock";

export const cityMock: CityEntity = {
  id: 4480,
  stateId: stateMock.id,
  name: 'Teresina',
  state: stateMock,
  createdAt: new Date(),
  updatedAt: new Date(),
};