import { PaymentStatusEntity } from "../entities/payment-status.entity";

export class ReturnPaymentStatusDto {
  id: number;
  name: string;

  constructor(paymentStatusEntity: PaymentStatusEntity) {
    this.id = paymentStatusEntity.id;
    this.name = paymentStatusEntity.name;
  }
}