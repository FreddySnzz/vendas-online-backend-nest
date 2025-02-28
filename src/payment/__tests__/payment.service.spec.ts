import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { PaymentService } from '../payment.service';
import { PaymentEntity } from '../entities/payment.entity';
import { finalPriceMock, paymentMock } from '../__mocks__/payment.mock';
import { createOrderCreditCardMock, createOrderPixMock } from '../../order/__mocks__/create-order.mock';
import { productMock } from '../../product/__mocks__/product.mock';
import { cartMock } from '../../cart/__mocks__/cart.mock';
import { paymentPixMock } from '../__mocks__/payment-pix.mock';
import { paymentCreditCardMock } from '../__mocks__/payment-credit-card.mock';
import { PaymentPixEntity } from '../entities/payment-pix.entity';
import { PaymentCreditCardEntity } from '../entities/payment-credit-card.entity';
import { cartProductMock } from '../../cart-product/__mocks__/cart-product.mock';
import { PaymentType } from '../../payment-status/enum/payment-type.enum';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepository: Repository<PaymentEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(PaymentEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(paymentMock),
          },
        }
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    paymentRepository = module.get<Repository<PaymentEntity>>(
      getRepositoryToken(PaymentEntity)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(paymentRepository).toBeDefined();
  });

  describe('Create Payment', () => {
    it('should return a payment entity by pix method', async () => {
      const spy = jest.spyOn(paymentRepository, 'save');
      const payment = await service.createPayment(
        createOrderPixMock, 
        [productMock], 
        cartMock
      );

      const savePix: PaymentPixEntity = spy.mock
        .calls[0][0] as PaymentPixEntity;

      expect(payment).toEqual(paymentMock);
      expect(savePix.code).toEqual(paymentPixMock.code);
      expect(savePix.datePayment).toEqual(paymentPixMock.datePayment);
    });

    it('should return a payment entity by credit card method', async () => {
      const spy = jest.spyOn(paymentRepository, 'save');
      const payment = await service.createPayment(
        createOrderCreditCardMock, 
        [productMock], 
        cartMock
      );

      const saveCreditCard: PaymentCreditCardEntity = spy.mock
        .calls[0][0] as PaymentCreditCardEntity;

      expect(payment).toEqual(paymentMock);
      expect(saveCreditCard.amountPayments).toEqual(
        paymentCreditCardMock.amountPayments
      );
    });

    it('should return exception in not send data', async () => {
      expect(
        service.createPayment(
          {
            addressId: createOrderCreditCardMock.addressId,
          },
          [productMock],
          cartMock,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return final price 0 in cartProduct undefined', async () => {
      const spy = jest.spyOn(paymentRepository, 'save');
      await service.createPayment(
        createOrderCreditCardMock,
        [productMock],
        cartMock,
      );
  
      const savePayment: PaymentCreditCardEntity = spy.mock
        .calls[0][0] as PaymentCreditCardEntity;
  
      expect(savePayment.finalPrice).toEqual(0);
    });

    it('should return final price sending cartProduct', async () => {
      const spy = jest.spyOn(paymentRepository, 'save');
      await service.createPayment(
        createOrderCreditCardMock,
        [productMock],
        {
          ...cartMock,
          cartProduct: [cartProductMock]
        },
      );
  
      const savePayment: PaymentCreditCardEntity = spy.mock
        .calls[0][0] as PaymentCreditCardEntity;
  
      expect(savePayment.finalPrice).toEqual(finalPriceMock);
    });

    it('should return all data in save payment', async () => {
      const spy = jest.spyOn(paymentRepository, 'save');
      await service.createPayment(createOrderCreditCardMock, [productMock], {
        ...cartMock,
        cartProduct: [cartProductMock],
      });
  
      const savePayment: PaymentCreditCardEntity = spy.mock
        .calls[0][0] as PaymentCreditCardEntity;
  
      const paymentCreditCard: PaymentCreditCardEntity = new PaymentCreditCardEntity(
        PaymentType.Done,
        finalPriceMock,
        0,
        finalPriceMock,
        createOrderCreditCardMock,
      );
  
      expect(savePayment).toEqual(paymentCreditCard);
    });
  });
})
