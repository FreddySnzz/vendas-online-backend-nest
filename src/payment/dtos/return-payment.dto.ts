import { ReturnPaymentStatusDto } from "../../payment-status/dtos/return-payment-status.dto";
import { PaymentEntity } from "../entities/payment.entity";
import { PaymentPixEntity } from "../entities/payment-pix.entity";
import { PaymentCreditCardEntity } from "../entities/payment-credit-card.entity";

export class ReturnPaymentDto {
  id: number;
  price: number;
  discount: number;
  finalPrice: number;
  code?: string;
  datePayment?: Date;
  amountPayments?: number;
  type: string;
  createdAt: Date;
  paymentStatus?: ReturnPaymentStatusDto;

  constructor(payment: PaymentEntity) {
    this.id = payment.id;
    this.price = payment.price;
    this.discount = payment.discount;
    this.finalPrice = payment.finalPrice;
    this.type = payment.type;
    this.createdAt = payment.createdAt;
    this.paymentStatus = payment.paymentStatus
      ? new ReturnPaymentStatusDto(payment.paymentStatus)
      : undefined;

    if (payment instanceof PaymentPixEntity) {
      this.code = payment.code;
      this.datePayment = payment.datePayment;
    } else if (payment instanceof PaymentCreditCardEntity) {
      this.amountPayments = payment.amountPayments;
    };
  }
}