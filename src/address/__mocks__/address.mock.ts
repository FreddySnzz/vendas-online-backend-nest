import { cityMock } from "../../city/__mocks__/city.mock";
import { AddressEntity } from "../entities/address.entity";
import { userEntityMock } from "../../user/__mocks__/user.mock";

export const addressMock: AddressEntity = {
  id: 1,
  cityId: cityMock.id,
  userId: userEntityMock.id,
  cep: '00000-000',
  numberAddress: 123,
  complement: 'Rua de teste',
  createdAt: new Date(),
  updatedAt: new Date(),
};