import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartEntity } from './entities/cart.entity';
import { CartProductModule } from '../cart-product/cart-product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity]),
    CartProductModule
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService]
})
export class CartModule {}
