import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CartProductEntity } from './entities/cart-product.entity';
import { InsertProductInCartDto } from '../cart/dtos/insert-product-cart.dto';
import { CartEntity } from '../cart/entities/cart.entity';
import { ProductService } from '../product/product.service';
import { UpdateProductInCartDto } from '../cart/dtos/update-product-cart.dto';

@Injectable()
export class CartProductService {
  constructor (
    @InjectRepository(CartProductEntity)
    private readonly cartProductRepository: Repository<CartProductEntity>,
    private readonly productService: ProductService,
  ) {}

  async verifyProductInCart(
    productId: number,
    cartId: number,
  ): Promise<CartProductEntity> {
    const cartProduct = await this.cartProductRepository.findOne({
      where: {
        productId,
        cartId,
      },
    });

    if (!cartProduct) {
      throw new NotFoundException('Product not found in cart');
    };

    return cartProduct;
  };

  async createProductInCart(
    insertProductInCartDto: InsertProductInCartDto,
    cartId: number,
  ): Promise<CartProductEntity> {
    return this.cartProductRepository.save({
      amount: insertProductInCartDto.amount,
      productId: insertProductInCartDto.productId,
      cartId,
    });
  };

  async insertProductInCart(
    insertProductInCartDto: InsertProductInCartDto,
    cart: CartEntity,
  ): Promise<CartProductEntity> {
    await this.productService.findProductById(insertProductInCartDto.productId);
    
    const cartProduct = await this.verifyProductInCart(
      insertProductInCartDto.productId,
      cart.id,
    ).catch(() => undefined);

    if (!cartProduct) {
      return this.createProductInCart(insertProductInCartDto, cart.id);
    };

    return this.cartProductRepository.save({
      ...cartProduct,
      amount: cartProduct.amount + insertProductInCartDto.amount,
    });
  };

  async deleteProductInCart(
    productId: number, 
    cartId: number
  ): Promise<DeleteResult> {
    return await this.cartProductRepository.delete({ productId, cartId });
  };

  async updateProductInCart(
    updateProductInCart: UpdateProductInCartDto,
    cart: CartEntity,
  ): Promise<CartProductEntity> {
    await this.productService.findProductById(updateProductInCart.productId);

    const cartProduct = await this.verifyProductInCart(
      updateProductInCart.productId,
      cart.id,
    );

    return this.cartProductRepository.save({
      ...cartProduct,
      amount: updateProductInCart.amount,
    });
  };
}
