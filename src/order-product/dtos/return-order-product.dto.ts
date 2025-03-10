import { ReturnOrderDto } from "../../order/dtos/return-order.dto";
import { ReturnProductDto } from "../../product/dtos/return-product.dto";
import { OrderProductEntity } from "../entities/order-product.entity";

export class ReturnOrderProductDto {
  id: number;
  orderId: number;
  amount: number;
  price: number;
  createdAt: Date;
  product?: ReturnProductDto;
  order?: ReturnOrderDto;

  constructor(orderProductEntity: OrderProductEntity) {
    this.id = orderProductEntity.id;
    this.orderId = orderProductEntity.orderId;
    this.amount = orderProductEntity.amount;
    this.price = orderProductEntity.price;
    this.createdAt = orderProductEntity.createdAt;
    this.product = new ReturnProductDto(orderProductEntity.product);
    this.product = orderProductEntity.product 
    ? new ReturnProductDto(orderProductEntity.product) 
    : undefined;
    this.order = orderProductEntity.order
    ? new ReturnOrderDto(orderProductEntity.order)
    : undefined;
  }
}