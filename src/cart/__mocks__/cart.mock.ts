import { userEntityMock } from "../../user/__mocks__/user.mock";
import { CartEntity } from "../entities/cart.entity";

export const cartMock: CartEntity = {
  id: 1,
  active: true,
  userId: userEntityMock.id,
  cartProduct: [],
  createdAt: new Date(),
  updatedAt: new Date()
}