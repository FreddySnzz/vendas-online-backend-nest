import { InjectRepository } from '@nestjs/typeorm';
import { 
  BadRequestException, 
  forwardRef, 
  Inject, 
  Injectable, 
  NotFoundException 
} from '@nestjs/common';
import { 
  DeleteResult, 
  In, 
  Like, 
  Repository, 
  UpdateResult 
} from 'typeorm';

import { ProductEntity } from './entities/product.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { CategoryService } from '../category/category.service';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CountProductDto } from './dtos/count-product.dto';
import { Pagination, PaginationMeta } from '../dtos/pagination.dto';
import { ReturnProductDto } from './dtos/return-product.dto';

const DEFAULT_SIZE = 10;
const DEFAULT_PAGE = 1;

@Injectable()
export class ProductService {
  constructor (
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService
  ) {}

  async findAll(
    productId?: number[],
    isFindRelations?: boolean,
  ): Promise<ProductEntity[]> {
    let findOptions = {};

    if (productId && productId.length > 0) {
      findOptions = {
        where: {
          id: In(productId),
        }
      };
    };

    if (isFindRelations) {
      findOptions = {
        ...findOptions,
        relations: {
          category: true
        }
      };
    };

    const products = await this.productRepository.find(findOptions);

    if (!products || products.length === 0) {
      throw new NotFoundException(`Products not found`);
    };

    return products;
  };

  async findAllPaginated(
    productId?: number[],
    isFindRelations?: boolean,
    size = DEFAULT_SIZE,
    page = DEFAULT_PAGE,
  ): Promise<Pagination<ReturnProductDto[]>> {
    let findOptions = {};
    page = isNaN(Number(page)) ? DEFAULT_PAGE : Number(page);
    size = isNaN(Number(size)) ? DEFAULT_SIZE : Number(size);

    const skip = Number(page - 1) * Number(size);

    if (productId && productId.length > 0) {
      findOptions = {
        where: {
          id: In(productId),
        }
      };
    };

    if (isFindRelations) {
      findOptions = {
        ...findOptions,
        relations: {
          category: true
        }
      };
    };

    const [products, total] = await this.productRepository.findAndCount({
      ...findOptions,
      take: size,
      skip,
    });

    if (!products || total < 1) {
      throw new NotFoundException(`Products not found`);
    };

    const productsDto = products.map(product => new ReturnProductDto(product));

    return new Pagination(
      new PaginationMeta(
        size,
        total,
        page,
        Math.ceil(total / size)
      ), productsDto
    );
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

  async findProductById(id: number, isRelations?: boolean): Promise<ProductEntity> {
    let relations = isRelations 
    ? {
        category: true
      } 
    : undefined;

    const product = await this.productRepository.findOne({
      where: {
        id
      },
      relations
    });

    if (!product) {
      throw new NotFoundException(`Product with id: ${id} not found`);
    };

    return product;
  };

  async findProductByName(
    name: string,
  ): Promise<ProductEntity[]> {
    const product = await this.productRepository.find({
      where: {
        name: Like(`%${name}%`)
      },
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

  async updateProduct(productId: number, updateProduct: UpdateProductDto): Promise<UpdateResult> {
    await this.findProductById(productId);

    return this.productRepository.update(productId, updateProduct);
  };

  async countProductsByCategoryId(): Promise<CountProductDto[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .select('product.category_id', 'categoryId')
      .addSelect('COUNT(*)', 'total')
      .groupBy('product.category_id')
      .getRawMany();
  };
}
