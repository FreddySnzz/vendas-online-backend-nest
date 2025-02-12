import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';

import { ProductEntity } from './entities/product.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {

  constructor (
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoryService
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    const products = await this.productRepository.find();

    if (!products || products.length === 0) {
      throw new NotFoundException(`Products not found`);
    };

    return products;
  };

  async findAllByCategoryId(categoryId: number): Promise<ProductEntity[]> {
    const products = await this.productRepository.find({
      where: {
        categoryId
      }
    });

    if (!products || products.length === 0) {
      throw new NotFoundException(`Products not found by category ID: ${categoryId}`);
    };

    return products;
  };

  async findProductById(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        id
      }
    });

    if (!product) {
      throw new NotFoundException(`Product with id: ${id} not found`);
    };

    return product;
  };

  async findProductByName(name: string): Promise<ProductEntity[]> {
    const product = await this.productRepository.find({
      where: {
        name: Like(`%${name}%`)
      }
    });

    if (!product || product.length === 0) {
      throw new NotFoundException(`Product ${name} not found`);
    };

    return product;
  };

  async createProduct(createProductDto: CreateProductDto): Promise<ProductEntity> {
    await this.categoryService.findCategoryById(createProductDto.categoryId);

    const product = await this.findProductByName(createProductDto.name).catch(() => undefined);

    if (product) {
      throw new BadRequestException(`Product ${createProductDto.name} already exists`);
    };

    return await this.productRepository.save(createProductDto);
  };

  async deleteProductById(productId: number): Promise<DeleteResult> {
    await this.findProductById(productId);

    return this.productRepository.delete({ id: productId });
  };
}
