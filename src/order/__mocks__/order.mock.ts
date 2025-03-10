import { amountOrderProductMock } from '../../order-product/__mocks__/amount-order-product.mock';
import { addressMock } from '../../address/__mocks__/address.mock';
import { paymentMock } from '../../payment/__mocks__/payment.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { OrderEntity } from '../entities/order.entity';

export const orderMock: OrderEntity = {
  id: 3,
  addressId: addressMock.id,
  userId: userEntityMock.id,
  paymentId: paymentMock.id,
  amountProducts: Number(amountOrderProductMock.total),
  date: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};