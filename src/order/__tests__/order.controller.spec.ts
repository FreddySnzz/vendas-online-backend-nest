import { Test, TestingModule } from '@nestjs/testing';

import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';
import { orderMock } from '../__mocks__/order.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { createOrderPixMock } from '../__mocks__/create-order.mock';
import { addressMock } from '../../address/__mocks__/address.mock';
import { orderProductMock } from '../../order-product/__mocks__/order-product.mock';
import { paymentMock } from '../../payment/__mocks__/payment.mock';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn().mockResolvedValue(orderMock),
            findOrdersByUserId: jest.fn().mockResolvedValue([orderMock]),
            findAllOrders: jest.fn().mockResolvedValue([orderMock]),
          },
        },
      ],
      controllers: [OrderController],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(orderService).toBeDefined();
  });

  it('should return order in createOrder', async () => {
    const order = await controller.createOrder(
      createOrderPixMock, 
      userEntityMock.id
    );

    expect(order).toEqual(orderMock);
  });

  it('should return orders in findOrdersByUserId', async () => {
    const orders = await controller.findOrdersByUserId(userEntityMock.id);

    expect(orders).toEqual([{
      id: orderMock.id,
      date: orderMock.date,
      createdAt: orderMock.createdAt,
      address: orders[0].address ? addressMock : undefined,
      ordersProduct: orders[0].ordersProduct ? orderProductMock : undefined,
      payment: orders[0].payment ? paymentMock : undefined,
    }]);
  });

  it('should return order in findOrderById', async () => {
    const spy = jest.spyOn(orderService, 'findOrdersByUserId');
    const orders = await controller.findOrderById(orderMock.id);

    expect(orders).toEqual([{
      id: orderMock.id,
      date: orderMock.date,
      createdAt: orderMock.createdAt,
      address: orders[0].address ? addressMock : undefined,
      ordersProduct: orders[0].ordersProduct ? orderProductMock : undefined,
      payment: orders[0].payment ? paymentMock : undefined,
    }]);
    expect(spy.mock.calls.length).toEqual(1);
  });

  it('should return all orders', async () => {
    const spy = jest.spyOn(orderService, 'findAllOrders');
    const orders = await controller.findAllOrders();

    expect(orders).toEqual([{
      id: orderMock.id,
      date: orderMock.date,
      createdAt: orderMock.createdAt,
      address: orders[0].address ? addressMock : undefined,
      ordersProduct: orders[0].ordersProduct ? orderProductMock : undefined,
      payment: orders[0].payment ? paymentMock : undefined,
    }]);
    expect(spy.mock.calls.length).toEqual(1);
  });
});