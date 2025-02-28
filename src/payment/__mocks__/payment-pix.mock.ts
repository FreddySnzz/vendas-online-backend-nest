import { PaymentPixEntity } from "../entities/payment-pix.entity";
import { paymentMock } from "./payment.mock";

export const paymentPixMock: PaymentPixEntity = {
  ...paymentMock,
  code: '00020101021226860014br.gov.bcb.pix2561www.exemplo.com/pix/123456789012345678901234567890520400005303986540510.005802BR5910Joao6008SaoPaulo62070503***6304ABCD',
  datePayment: new Date('2025-03-01'),
};