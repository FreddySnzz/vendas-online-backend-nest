import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProductService } from '../product.service';
import { ProductEntity } from '../entities/product.entity';
import { productMock } from '../__mocks__/product.mock';
import { createProductMock } from '../__mocks__/create-product.mock';
import { CategoryService } from '../../category/category.service';
import { categoryMock } from '../../category/__mocks__/category.mock';

describe('ProductService', () => {
  let service: ProductService;
  let categoryService: CategoryService;
  let productRepository: Repository<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: CategoryService,
          useValue: {
            findCategoryById: jest.fn().mockResolvedValue(categoryMock)
          }
        },
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([productMock]),
            findOne: jest.fn().mockResolvedValue(productMock),
            save: jest.fn().mockResolvedValue(createProductMock),
          }
        }
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    categoryService = module.get<CategoryService>(CategoryService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryService).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  describe('Find all products', () => {
    it('should return all products', async () => {
      const products = await service.findAll();
  
      expect(products).toEqual([productMock]);
    });
  
    it('should return error if product list is empty', async () => {
      jest.spyOn(productRepository, "find").mockResolvedValue([]);
  
      expect(service.findAll()).rejects.toThrow();
    });
  
    it('should return error if exception', async () => {
      jest.spyOn(productRepository, "find").mockRejectedValue(new Error());
  
      expect(service.findAll()).rejects.toThrow();
    });
  });

  describe('Find products by id', () => {
    it('should return product by id', async () => {
      const product = await service.findProductById(productMock.id);
  
      expect(product).toEqual(productMock);
    });
  
    it('should return error if product not found', async () => {
      jest.spyOn(productRepository, "findOne").mockResolvedValue(undefined);
  
      expect(service.findProductById(productMock.id)).rejects.toThrow();
    });
  
    it('should return error if exception', async () => {
      jest.spyOn(productRepository, "findOne").mockRejectedValue(new Error());
  
      expect(service.findProductById(productMock.id)).rejects.toThrow();
    });
  });

  describe('Find products by name', () => {
    it('should return products by name', async () => {
      const product = await service.findProductByName(productMock.name);
  
      expect(product).toEqual([productMock]);
    });
  
    it('should return error if product not found', async () => {
      jest.spyOn(productRepository, "find").mockResolvedValue([]);
  
      expect(service.findProductByName(productMock.name)).rejects.toThrow();
    });
  
    it('should return error if exception', async () => {
      jest.spyOn(productRepository, "find").mockRejectedValue(new Error());
  
      expect(service.findProductByName(productMock.name)).rejects.toThrow();
    });
  });

  describe('Create product', () => {
    it('should return product created', async () => {
      jest.spyOn(categoryService, "findCategoryById").mockResolvedValue(categoryMock);
      jest.spyOn(productRepository, "find").mockResolvedValue([]);

      const product = await service.createProduct(createProductMock);
  
      expect(product).toEqual(createProductMock);
    });
  
    it('should return error if exception', async () => {
      jest.spyOn(productRepository, "save").mockRejectedValue(new Error());
  
      expect(service.createProduct(createProductMock)).rejects.toThrow();
    });
  });
});
