import { ReturnOrderProductDto } from "../../order-product/dtos/return-order-product.dto";
import { ReturnAddressDto } from "../../address/dto/return-address.dto";
import { OrderEntity } from "../entities/order.entity";
import { ReturnPaymentDto } from "../../payment/dtos/return-payment.dto";

export class ReturnOrderDto {
  id: number;
  date: Date;
  createdAt: Date;
  address?: ReturnAddressDto;
  ordersProduct?: ReturnOrderProductDto[];
  payment?: ReturnPaymentDto;

  constructor(orderEntity: OrderEntity) {
    this.id = orderEntity.id;
    this.date = orderEntity.date;
    this.createdAt = orderEntity.createdAt;
    this.address = orderEntity.address
      ? new ReturnAddressDto(orderEntity.address)
      : undefined;
    this.ordersProduct = orderEntity.ordersProduct
      ? orderEntity.ordersProduct.map(
        (orderProducts) => new ReturnOrderProductDto(orderProducts)
      ) : [];
    this.payment = orderEntity.payment
    ? new ReturnPaymentDto(orderEntity.payment)
    : undefined;
  };
}