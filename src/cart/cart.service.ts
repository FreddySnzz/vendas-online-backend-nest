import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { CartEntity } from './entities/cart.entity';
import { InsertProductInCartDto } from './dtos/insert-product-cart.dto';
import { CartProductService } from '../cart-product/cart-product.service';
import { UpdateProductInCartDto } from './dtos/update-product-cart.dto';

@Injectable()
export class CartService {
  constructor (
    @InjectRepository(CartEntity) 
    private readonly cartRepository: Repository<CartEntity>,
    private readonly cartProductService: CartProductService
  ) {}

  async findActiveCartByUserId(
    userId: number, 
    withRelations?: boolean
  ): Promise<CartEntity> {
    const relations = withRelations
      ? {
          cartProduct: {
            product: true,
          },
        }
      : undefined;

    const cart = await this.cartRepository.findOne({
      where: {
        userId: userId,
        active: true
      },
      relations: relations
    });

    if (!cart) {
      throw new NotFoundException(`Not found cart active`);
    };

    return cart;
  };

  async createCart(userId: number): Promise<CartEntity> {
    return await this.cartRepository.save({
      active: true,
      userId: userId
    });
  };

  async insertProductInCart(
    insertProductInCartDto: InsertProductInCartDto, 
    userId: number
  ): Promise<CartEntity> {
    const cart = await this.findActiveCartByUserId(userId).catch(
      async () => {
        return this.createCart(userId);
      }
    );

    await this.cartProductService.insertProductInCart(insertProductInCartDto, cart);

    return cart;
  };

  async clearCart(userId: number): Promise<UpdateResult> {
    const cart = await this.findActiveCartByUserId(userId);

    return await this.cartRepository.update(cart.id, {
      active: false
    });
  };

  async deleteProductInCart(
    userId: number, 
    productId: number
  ): Promise<DeleteResult> {
    const cart = await this.findActiveCartByUserId(userId);

    return await this.cartProductService.deleteProductInCart(productId, cart.id);
  };

  async updateProductInCart(
    updateProductInCart: UpdateProductInCartDto, 
    userId: number
  ): Promise<CartEntity> {
    const cart = await this.findActiveCartByUserId(userId).catch(
      async () => {
        return this.createCart(userId);
      }
    );

    await this.cartProductService.updateProductInCart(updateProductInCart, cart);

    return cart;
  };
}
