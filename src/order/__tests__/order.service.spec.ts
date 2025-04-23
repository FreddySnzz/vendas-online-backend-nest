import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { OrderService } from '../order.service';
import { OrderEntity } from '../entities/order.entity';
import { PaymentService } from '../../payment/payment.service';
import { CartService } from '../../cart/cart.service';
import { OrderProductService } from '../../order-product/order-product.service';
import { ProductService } from '../../product/product.service';
import { orderMock } from '../__mocks__/order.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { paymentMock } from '../../payment/__mocks__/payment.mock';
import { cartMock } from '../../cart/__mocks__/cart.mock';
import { cartProductMock } from '../../cart-product/__mocks__/cart-product.mock';
import { orderProductMock } from '../../order-product/__mocks__/order-product.mock';
import { productMock } from '../../product/__mocks__/product.mock';
import { createOrderPixMock } from '../__mocks__/create-order.mock';
import { amountOrderProductMock } from '../../order-product/__mocks__/amount-order-product.mock';

jest.useFakeTimers().setSystemTime(new Date('2025-03-01'));

describe('OrderService', () => {
  let service: OrderService;
  let paymentService: PaymentService;
  let cartService: CartService;
  let orderProductService: OrderProductService;
  let productService: ProductService;
  let orderRepositoty: Repository<OrderEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { 
          provide: PaymentService,
          useValue: {
            createPayment: jest.fn().mockResolvedValue(paymentMock),
          },
        },
        {
          provide: CartService,
          useValue: {
            findActiveCartByUserId: jest.fn().mockResolvedValue({
              ...cartMock,
              cartProduct: [cartProductMock],
            }),
            clearCart: jest.fn(),
          },
        },
        {
          provide: OrderProductService,
          useValue: {
            createOrderProduct: jest.fn().mockResolvedValue(orderProductMock),
            findAmountProductsByOrderId: jest.fn().mockResolvedValue([amountOrderProductMock]),
          },
        },
        {
          provide: ProductService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([productMock]),
          },
        },
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([orderMock]),
            save: jest.fn().mockResolvedValue(orderMock),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    paymentService = module.get<PaymentService>(PaymentService);
    cartService = module.get<CartService>(CartService);
    orderProductService = module.get<OrderProductService>(
      OrderProductService,
    );
    productService = module.get<ProductService>(ProductService);
    orderRepositoty = module.get<Repository<OrderEntity>>(
      getRepositoryToken(OrderEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(orderRepositoty).toBeDefined();
    expect(paymentService).toBeDefined();
    expect(cartService).toBeDefined();
    expect(orderProductService).toBeDefined();
    expect(productService).toBeDefined();
  });

  describe('Find Orders By User ID', () => {
    it('should return an array of orders', async () => {
      const spy = jest.spyOn(orderRepositoty, 'find');
      const result = await service.findOrdersByUserId(userEntityMock.id);

      expect(result).toEqual([orderMock]);
      expect(spy.mock.calls[0][0]).toEqual({
        where: {
          userId: userEntityMock.id,
        },
        relations: {
          address: {
            city: {
              state: true,
            }
          },
          ordersProduct: {
            product: true
          },
          payment: {
            paymentStatus: true
          },
          user: false
        },
      })
    });

    it('should return NotFoundException if orders not found', async () => {
      jest.spyOn(orderRepositoty, 'find').mockResolvedValue([]);

      expect(service.findOrdersByUserId(userEntityMock.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Find All Orders', () => {
    it('should return orders', async () => {
      const spy = jest.spyOn(orderRepositoty, 'find');
      const orders = await service.findAllOrders();
  
      expect(orders).toEqual([orderMock]);
      expect(spy.mock.calls[0][0]).toEqual({
        relations: {
          user: true,
        },
      });
    });
  
    it('should error in not found', async () => {
      jest.spyOn(orderRepositoty, 'find').mockResolvedValue([]);
  
      expect(service.findAllOrders()).rejects.toThrow(
        new NotFoundException('Orders not found'),
      );
    });
  });

  describe('Create Order Product Using Cart', () => {
    it('should call createOrderProduct amount cartProduct in cart', async () => {
      const spyOrderProduct = jest.spyOn(
        orderProductService,
        'createOrderProduct',
      );

      const createOrderProductUsingCart =
        await service.createOrderProductUsingCart(
          {
            ...cartMock,
            cartProduct: [cartProductMock, cartProductMock],
          },
          orderMock.id,
          [productMock],
        );

      expect(createOrderProductUsingCart).toEqual([
        orderProductMock,
        orderProductMock,
      ]);
      expect(spyOrderProduct.mock.calls.length).toEqual(2);
    });
  });

  describe('Save Order', () => {
    it('should return order in saveOrder', async () => {
      const spy = jest.spyOn(orderRepositoty, 'save');
  
      const order = await service.saveOrder(
        createOrderPixMock,
        userEntityMock.id,
        paymentMock,
      );
  
      expect(order).toEqual(orderMock);
      expect(spy.mock.calls[0][0]).toEqual({
        addressId: createOrderPixMock.addressId,
        date: new Date(),
        paymentId: paymentMock.id,
        userId: userEntityMock.id,
      });
    });

    it('should expection in error save', async () => {
      jest.spyOn(orderRepositoty, 'save').mockRejectedValue(new Error());
  
      expect(
        service.saveOrder(createOrderPixMock, userEntityMock.id, paymentMock),
      ).rejects.toThrow();
    });
  });

  describe('Create Order', () => {
    it('should return order in create order success', async () => {
      const spyCartService = jest.spyOn(cartService, 'findActiveCartByUserId');
      const spyProductService = jest.spyOn(productService, 'findAll');
      const spyCartServiceClear = jest.spyOn(cartService, 'clearCart');
      const spyOrderProductService = jest.spyOn(
        orderProductService,
        'createOrderProduct',
      );
      const spyPaymentService = jest.spyOn(paymentService, 'createPayment');
      const spySave = jest.spyOn(orderRepositoty, 'save');
  
      const order = await service.createOrder(
        createOrderPixMock,
        userEntityMock.id,
      );
  
      expect(order).toEqual(orderMock);
      expect(spyCartService.mock.calls.length).toEqual(1);
      expect(spyProductService.mock.calls.length).toEqual(1);
      expect(spyPaymentService.mock.calls.length).toEqual(1);
      expect(spySave.mock.calls.length).toEqual(1);
      expect(spyOrderProductService.mock.calls.length).toEqual(1);
      expect(spyCartServiceClear.mock.calls.length).toEqual(1);
    });
  });
});