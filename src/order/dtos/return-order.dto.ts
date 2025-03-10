import { ReturnOrderProductDto } from "../../order-product/dtos/return-order-product.dto";
import { ReturnAddressDto } from "../../address/dto/return-address.dto";
import { OrderEntity } from "../entities/order.entity";
import { ReturnPaymentDto } from "../../payment/dtos/return-payment.dto";
import { ReturnUserDto } from "../../user/dtos/return-user.dto";

export class ReturnOrderDto {
  id: number;
  date: Date;
  createdAt: Date;
  user?: ReturnUserDto;
  address?: ReturnAddressDto;
  ordersProduct?: ReturnOrderProductDto[];
  payment?: ReturnPaymentDto;

  constructor(orderEntity: OrderEntity) {
    this.id = orderEntity.id;
    this.date = orderEntity.date;
    this.createdAt = orderEntity.createdAt;
    this.user = orderEntity.user 
      ? new ReturnUserDto(orderEntity.user) 
      : undefined;
    this.address = orderEntity.address
      ? new ReturnAddressDto(orderEntity.address)
      : undefined;
    this.ordersProduct = orderEntity.ordersProduct
      ? orderEntity.ordersProduct.map(
        (orderProducts) => new ReturnOrderProductDto(orderProducts)
      ) : undefined;
    this.payment = orderEntity.payment
      ? new ReturnPaymentDto(orderEntity.payment)
      : undefined;
  };
}