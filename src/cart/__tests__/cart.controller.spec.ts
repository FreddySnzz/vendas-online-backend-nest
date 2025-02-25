import { Test, TestingModule } from '@nestjs/testing';

import { userEntityMock } from '../../user/__mocks__/user.mock';
import { CartController } from '../cart.controller';
import { CartService } from '../cart.service';
import { insertProductInCartMock } from '../__mocks__/insert-product-in-cart.mock';
import { cartMock } from '../__mocks__/cart.mock';
import { returnUpdateMock } from '../../__mocks__/return-update.mock';
import { updateProductInCartMock } from '../__mocks__/update-product-in-cart.mock';
import { returnDeleteMock } from '../../__mocks__/return-delete.mock';
import { productMock } from '../../product/__mocks__/product.mock';

describe('CartController', () => {
  let controller: CartController;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CartService,
          useValue: {
            insertProductInCart: jest.fn().mockResolvedValue(cartMock),
            findActiveCartByUserId: jest.fn().mockResolvedValue(cartMock),
            clearCart: jest.fn().mockResolvedValue(returnUpdateMock),
            updateProductInCart: jest.fn().mockResolvedValue(cartMock),
            deleteProductInCart: jest.fn().mockResolvedValue(returnDeleteMock),
          },
        },
      ],
      controllers: [CartController],
    }).compile();

    controller = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(cartService).toBeDefined();
  });

  it('Insert Product in Cart', async () => {
    const cart = await controller.insertProductInCart(insertProductInCartMock, userEntityMock.id);

    expect(cart).toEqual({
      id: cartMock.id,
      cartProduct: []
    });
  });

  it('Find Cart By UserId', async () => {
    const cart = await controller.findActiveCartByUserId(userEntityMock.id);

    expect(cart).toEqual({
      id: cartMock.id,
      cartProduct: []
    });
  });

  it('Clear Cart', async () => {
    const cart = await controller.clearCart(userEntityMock.id);
    
    expect(cart).toEqual(returnUpdateMock);
  });

  it('Update Product in Cart', async () => {
    const cart = await controller.updateProductInCart(updateProductInCartMock, userEntityMock.id);
    
    expect(cart).toEqual({
      id: cartMock.id,
      cartProduct: []
    });
  });

  it('Delete Product in Cart', async () => {
    const cart = await controller.deleteProductInCart(userEntityMock.id, productMock.id);
    
    expect(cart).toEqual(returnDeleteMock);
  });
});