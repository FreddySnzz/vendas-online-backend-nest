import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { CartProductService } from '../cart-product.service';
import { CartProductEntity } from '../entities/cart-product.entity';
import { ProductService } from '../../product/product.service';
import { productMock } from '../../product/__mocks__/product.mock';
import { cartMock } from '../../cart/__mocks__/cart.mock';
import { returnDeleteMock } from '../../__mocks__/return-delete.mock';
import { insertProductInCartMock } from '../../cart/__mocks__/insert-product-in-cart.mock';
import { cartProductMock } from '../__mocks__/cart-product.mock';
import { updateProductInCartMock } from '../../cart/__mocks__/update-product-in-cart.mock';

describe('CartProductService', () => {
  let service: CartProductService;
  let productService: ProductService;
  let cartProductRepository: Repository<CartProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartProductService,
        {
          provide: ProductService,
          useValue: {
            findProductById: jest.fn().mockResolvedValue(productMock)
          }
        },
        {
          provide: getRepositoryToken(CartProductEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(cartProductMock),
            save: jest.fn().mockResolvedValue(cartProductMock),
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
          }
        }
      ],
    }).compile();

    service = module.get<CartProductService>(CartProductService);
    productService = module.get<ProductService>(ProductService);
    cartProductRepository = module.get<Repository<CartProductEntity>>(
      getRepositoryToken(CartProductEntity)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productService).toBeDefined();
    expect(cartProductRepository).toBeDefined();
  });

  describe('Create product in cart', () => {
    it('should return created product after create', async() => {
      const result = await service.createProductInCart(insertProductInCartMock, cartMock.id);

      expect(result).toEqual(cartProductMock);
    });

    it('should return error exception in create', async() => {
      jest.spyOn(cartProductRepository, 'save').mockRejectedValue(new Error());

      expect(service.createProductInCart(insertProductInCartMock, cartMock.id)).rejects.toThrow();
    });
  });

  describe('Verify product in cart', () => {
    it('should return product in cart if exist', async() => {
      const result = await service.verifyProductInCart(productMock.id, cartMock.id);

      expect(result).toEqual(cartProductMock);
    });

    it('should return error exception in db', async() => {
      jest.spyOn(cartProductRepository, 'findOne').mockRejectedValue(new Error());

      expect(service.verifyProductInCart(productMock.id, cartMock.id)).rejects.toThrow();
    });

    it('should return error exception if product not found in cart', async() => {
      jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

      expect(service.verifyProductInCart(productMock.id, cartMock.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Insert product in cart', () => {
    it('should return error in exception insertProductInCart', async () => {
      jest
        .spyOn(productService, 'findProductById')
        .mockRejectedValue(new NotFoundException());
  
      expect(
        service.insertProductInCart(insertProductInCartMock, cartMock),
      ).rejects.toThrow(NotFoundException);
    });
  
    it('should return product if not exist in cart', async () => {
      const spy = jest.spyOn(cartProductRepository, 'save');
      jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);
  
      const cartProduct = await service.insertProductInCart(
        insertProductInCartMock,
        cartMock,
      );
  
      expect(cartProduct).toEqual(cartProductMock);
      expect(spy.mock.calls[0][0].amount).toEqual(insertProductInCartMock.amount);
    });
  
    it('should return cart product if not exist cart', async () => {
      const spy = jest.spyOn(cartProductRepository, 'save');
  
      const cartProduct = await service.insertProductInCart(
        insertProductInCartMock,
        cartMock,
      );
  
      expect(cartProduct).toEqual(cartProductMock);
      expect(spy.mock.calls[0][0]).toEqual({
        ...cartProductMock,
        amount: cartProductMock.amount + insertProductInCartMock.amount,
      });
    });
  });

  describe('Update product in cart', () => {
    it('should return error in exception updateProductInCart', async () => {
      jest
        .spyOn(productService, 'findProductById')
        .mockRejectedValue(new NotFoundException());
  
      expect(
        service.updateProductInCart(updateProductInCartMock, cartMock),
      ).rejects.toThrow(NotFoundException);
    });
  
    it('should return product if not exist in cart (updateProductInCart)', async () => {
      jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);
  
      expect(
        service.updateProductInCart(updateProductInCartMock, cartMock),
      ).rejects.toThrow(NotFoundException);
    });
  
    it('should return cart product if not exist cart (updateProductInCart)', async () => {
      const spy = jest.spyOn(cartProductRepository, 'save');
  
      const cartProduct = await service.updateProductInCart(
        updateProductInCartMock,
        cartMock,
      );
  
      expect(cartProduct).toEqual(cartProductMock);
      expect(spy.mock.calls[0][0].amount).toEqual(updateProductInCartMock.amount);
    });
  });

  describe('Delete product in cart', () => {
    it('should return delete result after delete product', async() => {
      const result = await service.deleteProductInCart(productMock.id, cartMock.id);

      expect(result).toEqual(returnDeleteMock);
    });

    it('should return error exception in delete', async() => {
      jest.spyOn(cartProductRepository, 'delete').mockRejectedValue(new Error());

      expect(service.deleteProductInCart(productMock.id, cartMock.id)).rejects.toThrow();
    });
  });
});
