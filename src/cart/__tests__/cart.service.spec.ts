import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { CartService } from '../cart.service';
import { CartEntity } from '../entities/cart.entity';
import { cartMock } from '../__mocks__/cart.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { insertProductInCartMock } from '../__mocks__/insert-product-in-cart.mock';
import { productMock } from '../../product/__mocks__/product.mock';
import { CartProductService } from '../../cart-product/cart-product.service';
import { returnDeleteMock } from '../../__mocks__/return-delete.mock';
import { returnUpdateMock } from '../../__mocks__/return-update.mock';
import { updateProductInCartMock } from '../__mocks__/update-product-in-cart.mock';

describe('CartService', () => {
  let service: CartService;
  let cartProductService: CartProductService;
  let cartRepository: Repository<CartEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: CartProductService,
          useValue: {
            updateProductInCart: jest.fn().mockResolvedValue(cartMock),
            insertProductInCart: jest.fn().mockResolvedValue(cartMock),
            deleteProductInCart: jest.fn().mockResolvedValue(returnDeleteMock),
          }
        },
        {
          provide: getRepositoryToken(CartEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(cartMock),
            update: jest.fn().mockResolvedValue(returnUpdateMock),
            save: jest.fn().mockResolvedValue(cartMock),
          }
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartProductService = module.get<CartProductService>(CartProductService);
    cartRepository = module.get<Repository<CartEntity>>(
      getRepositoryToken(CartEntity)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cartProductService).toBeDefined();
    expect(cartRepository).toBeDefined();
  });

  describe('Find cart active by user id', () => {
    it('should return cart without relations by user id', async () => {
      const spy = jest.spyOn(cartRepository, 'findOne');
      const cart = await service.findActiveCartByUserId(userEntityMock.id);

      expect(spy.mock.calls[0][0].relations).toEqual(undefined);
      expect(cart).toEqual(cartMock);
    });

    it('should return cart with relations by user id', async () => {
      const spy = jest.spyOn(cartRepository, 'findOne');
      const cart = await service.findActiveCartByUserId(userEntityMock.id, true);

      expect(spy.mock.calls[0][0].relations).toEqual({
        cartProduct: {
          product: true,
        },
      });
      expect(cart).toEqual(cartMock);
    });

    it('should return exception if cart is not active', async () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);

      expect(service.findActiveCartByUserId(userEntityMock.id)).rejects.toThrow();
    });

    it('should return exception if user not found', async () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);

      expect(service.findActiveCartByUserId(userEntityMock.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Create cart', () => {
    it('should return cart after create', async () => {
      const cart = await service.createCart(userEntityMock.id);

      expect(cart).toEqual(cartMock);
    });

    it('should return exception if cart was created', async () => {
      jest.spyOn(cartRepository, "save").mockRejectedValue(new Error());

      expect(service.createCart(userEntityMock.id)).rejects.toThrow()
    });
  });

  describe('Clear cart', () => {
    it('should return Update Result after clear cart', async () => {
      const result = await service.clearCart(userEntityMock.id);

      expect(result).toEqual(returnUpdateMock);
    });

    it('should return exception if cart not found', async () => {
      jest.spyOn(cartRepository, "update").mockRejectedValue(new NotFoundException());

      expect(service.clearCart(userEntityMock.id)).rejects.toThrow(NotFoundException)
    });
  });

  describe('Insert product in cart', () => {
    it('should return an new cart if product was added', async () => {
      jest.spyOn(cartRepository, 'findOne').mockRejectedValue(undefined);

      const spyCreateCart = jest.spyOn(cartRepository, 'save');
      const spyInsertProductInCart = jest.spyOn(
        cartProductService, 
        'insertProductInCart'
      );

      const cart = await service.insertProductInCart(
        insertProductInCartMock, 
        userEntityMock.id
      );

      expect(cart).toEqual(cartMock);
      expect(spyCreateCart.mock.calls.length).toEqual(1);
      expect(spyInsertProductInCart.mock.calls.length).toEqual(1);
    });

    it('should return an existent cart if product was added', async () => {
      const spyCreateCart = jest.spyOn(cartRepository, 'save');
      const spyInsertProductInCart = jest.spyOn(
        cartProductService, 
        'insertProductInCart'
      );

      const cart = await service.insertProductInCart(
        insertProductInCartMock, 
        userEntityMock.id
      );

      expect(cart).toEqual(cartMock);
      expect(spyCreateCart.mock.calls.length).toEqual(0);
      expect(spyInsertProductInCart.mock.calls.length).toEqual(1);
    });
  });

  describe('Update product in cart', () => {
    it('should return an new cart if product was updated', async () => {
      jest.spyOn(cartRepository, 'findOne').mockRejectedValue(undefined);

      const spyCreateCart = jest.spyOn(cartRepository, 'save');
      const spyUpdateProductInCart = jest.spyOn(
        cartProductService, 
        'updateProductInCart'
      );

      const cart = await service.updateProductInCart(
        updateProductInCartMock, 
        userEntityMock.id
      );

      expect(cart).toEqual(cartMock);
      expect(spyCreateCart.mock.calls.length).toEqual(1);
      expect(spyUpdateProductInCart.mock.calls.length).toEqual(1);
    });

    it('should return an existent cart if product was updated', async () => {
      const spyCreateCart = jest.spyOn(cartRepository, 'save');
      const spyUpdateProductInCart = jest.spyOn(
        cartProductService, 
        'updateProductInCart'
      );

      const cart = await service.updateProductInCart(
        updateProductInCartMock, 
        userEntityMock.id
      );

      expect(cart).toEqual(cartMock);
      expect(spyCreateCart.mock.calls.length).toEqual(0);
      expect(spyUpdateProductInCart.mock.calls.length).toEqual(1);
    });
  });

  describe('Delete product in cart', () => {
    it('should return delete result after delete product', async() => {
      const spy = jest.spyOn(cartProductService, "deleteProductInCart");
      const result = await service.deleteProductInCart(userEntityMock.id, productMock.id);

      expect(spy.mock.calls.length).toEqual(1);
      expect(result).toEqual(returnDeleteMock);
    });

    it('should return error exception in delete', async() => {
      const spy = jest.spyOn(cartProductService, "deleteProductInCart");
      jest.spyOn(service, 'deleteProductInCart').mockRejectedValue(new NotFoundException());
      
      expect(service.deleteProductInCart(userEntityMock.id, productMock.id)).rejects.toThrow(NotFoundException);
      expect(spy.mock.calls.length).toEqual(0);
    });
  });
});
