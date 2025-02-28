import { cartProductMock } from "../../cart-product/__mocks__/cart-product.mock";
import { PaymentType } from "../../payment-status/enum/payment-type.enum";
import { PaymentEntity } from "../entities/payment.entity";
import { productMock } from "../../product/__mocks__/product.mock";

export const paymentMock: PaymentEntity = {
  id: 1,
  price: 100,
  discount: 0,
  finalPrice: 100,
  statusId: PaymentType.Done,
  type: 'pix',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const finalPriceMock: number = Number((cartProductMock.amount * productMock.price).toFixed(2));