import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';

import { CartService } from './cart.service';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { InsertProductInCartDto } from './dtos/insert-product-cart.dto';
import { UserId } from '../decorators/user-id.decorator';
import { ReturnCartDto } from './dtos/return-cart.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateProductInCartDto } from './dtos/update-product-cart.dto';

@Roles(UserType.Admin, UserType.User)
@Controller('cart')
export class CartController {
  constructor (private readonly cartService: CartService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async insertProductInCart(
    @Body() insertProductInCartDto: InsertProductInCartDto,
    @UserId() userId: number
  ): Promise<ReturnCartDto> {
    return new ReturnCartDto(await this.cartService.insertProductInCart(
      insertProductInCartDto, userId
    ));
  };

  @Get()
  async findActiveCartByUserId(
    @UserId() userId: number
  ): Promise<ReturnCartDto> {
    return new ReturnCartDto(await this.cartService.findActiveCartByUserId(
      userId, true
    ));
  };

  @Patch()
  async clearCart(
    @UserId() userId: number
  ): Promise<UpdateResult> {
    return await this.cartService.clearCart(userId);
  };

  @UsePipes(ValidationPipe)
  @Patch('/product')
  async updateProductInCart(
    @Body() updateProductInCartDto: UpdateProductInCartDto,
    @UserId() userId: number
  ): Promise<ReturnCartDto> {
    return new ReturnCartDto(
      await this.cartService.updateProductInCart(updateProductInCartDto, userId)
    );
  };

  @Delete('/product/:productId')
  async deleteProductInCart(
    @Param('productId') productId: number,
    @UserId() userId: number
  ): Promise<DeleteResult> {
    return await this.cartService.deleteProductInCart(userId, productId);
  };
}
