import { Test, TestingModule } from '@nestjs/testing';
import { In, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProductService } from '../product.service';
import { ProductEntity } from '../entities/product.entity';
import { productMock } from '../__mocks__/product.mock';
import { createProductMock } from '../__mocks__/create-product.mock';
import { CategoryService } from '../../category/category.service';
import { categoryMock } from '../../category/__mocks__/category.mock';
import { returnDeleteMock } from '../../__mocks__/return-delete.mock';
import { updateProductMock } from '../__mocks__/update-product.mock';

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
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
            update: jest.fn().mockResolvedValue(updateProductMock),
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

    it('should return all products with relations', async () => {
      const spy = jest.spyOn(productRepository, "find");
      const products = await service.findAll([], true);
  
      expect(products).toEqual([productMock]);
      expect(spy.mock.calls[0][0]).toEqual({
        relations: {
          category: true
        }
      })
    });

    it('should return all products by ids and with relations', async () => {
      const spy = jest.spyOn(productRepository, "find");
      const products = await service.findAll([productMock.id], true);
  
      expect(products).toEqual([productMock]);
      expect(spy.mock.calls[0][0]).toEqual({
        where: {
          id: In([productMock.id]),
        },
        relations: {
          category: true
        }
      })
    });

    it('should return all products searching by id', async () => {
      const products = await service.findAll([productMock.id]);
      
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

  describe('Find all products by category id', () => {
    it('should return all products by category id', async () => {
      const products = await service.findAllByCategoryId(categoryMock.id);
  
      expect(products).toEqual([productMock]);
    });
  
    it('should return error if product list is empty', async () => {
      jest.spyOn(productRepository, "find").mockResolvedValue([]);
  
      expect(service.findAllByCategoryId(categoryMock.id)).rejects.toThrow();
    });
  
    it('should return error if exception', async () => {
      jest.spyOn(productRepository, "find").mockRejectedValue(new Error());
  
      expect(service.findAllByCategoryId(categoryMock.id)).rejects.toThrow();
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

  describe('Delete product by id', () => {
    it('should return product deleted', async () => {
      const productDeleted = await service.deleteProductById(productMock.id);
  
      expect(productDeleted).toEqual(returnDeleteMock);
    });
  
    it('should return error if exception', async () => {
      jest.spyOn(productRepository, "delete").mockRejectedValue(new Error());
  
      expect(service.deleteProductById(productMock.id)).rejects.toThrow();
    });
  });

  describe('Update product by id', () => {
    it('should return product updated', async () => {
      const productUpdated = await service.updateProduct(productMock.id, updateProductMock);
  
      expect(productUpdated).toEqual(updateProductMock);
    });
  
    it('should return error if exception', async () => {
      jest.spyOn(productRepository, "update").mockRejectedValue(new Error());
  
      expect(service.updateProduct(productMock.id, updateProductMock)).rejects.toThrow();
    });
  });
});
