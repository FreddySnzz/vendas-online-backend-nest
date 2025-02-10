import { Body, Controller, Get, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';

import { ProductService } from './product.service';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { ReturnProductDto } from './dtos/return-product.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductEntity } from './entities/product.entity';

@Roles(UserType.User, UserType.Admin)
@Controller('product')
export class ProductController {
  constructor (private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<ReturnProductDto[]> {
    return (await this.productService.findAll()).map(
      product => new ReturnProductDto(product)
    );
  };

  @Get('search')
  async findProductByName(
    @Query('product_name') productName: string
  ): Promise<ReturnProductDto[]> {
    return (await this.productService.findProductByName(productName)).map(
      product => new ReturnProductDto(product)
    );
  };

  @Get('/:id')
  async findProductById(
    @Param('id') id: number
  ): Promise<ReturnProductDto> {
    return new ReturnProductDto(await this.productService.findProductById(id));
  };

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async createProduct(
    @Body() createProduct: CreateProductDto
  ): Promise<ProductEntity> {
    return await this.productService.createProduct(createProduct);
  };
}
