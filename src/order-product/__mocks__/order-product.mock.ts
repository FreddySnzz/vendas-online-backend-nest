import { orderMock } from '../../order/__mocks__/order.mock';
import { productMock } from '../../product/__mocks__/product.mock';
import { OrderProductEntity } from '../entities/order-product.entity';

export const orderProductMock: OrderProductEntity = {
  id: 45543,
  amount: 4,
  price: 54.90,
  orderId: orderMock.id,
  productId: productMock.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};