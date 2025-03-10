import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CategoryService } from '../category.service';
import { CategoryEntity } from '../entities/category.entity';
import { categoryMock } from '../__mocks__/category.mock';
import { createCategoryMock } from '../__mocks__/create-category.mock';
import { ProductService } from '../../product/product.service';
import { countProductMock } from '../../product/__mocks__/count-product.mock';
import { ReturnCategoryDto } from '../dtos/return-category.dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<CategoryEntity>;
  let productService: ProductService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ 
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([categoryMock]),
            findOne: jest.fn().mockResolvedValue(categoryMock),
            save: jest.fn().mockResolvedValue(categoryMock)
          }
        },
        {
          provide: ProductService,
          useValue: {
            countProductsByCategoryId: jest.fn().mockResolvedValue([countProductMock])
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity)
    );
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryRepository).toBeDefined();
    expect(productService).toBeDefined();
  });

  describe('Find all categories', () => {
    it('should return all categories', async () => {
      const categories = await service.getAllCategories();
  
      expect(categories).toEqual([
        new ReturnCategoryDto(
          categoryMock,
          countProductMock.total
        )
      ]);
    });
  
    it('should return error in list categories empty', async () => {
      jest.spyOn(categoryRepository, 'find').mockResolvedValue([]);
  
      expect(service.getAllCategories()).rejects.toThrow();
    });
  
    it('should return error in list categories exception', async () => {
      jest.spyOn(categoryRepository, 'find').mockRejectedValue(new Error());
  
      expect(service.getAllCategories()).rejects.toThrow();
    });
  });

  describe('Find category by name', () => {
    it('should return category by name', async () => {
      const category = await service.findCategoryByName(createCategoryMock.name);
  
      expect(category).toEqual([categoryMock]);
    });
  
    it('should return error if not found category by name', async () => {
      jest.spyOn(categoryRepository, 'find').mockResolvedValue([]);
  
      expect(service.findCategoryByName(createCategoryMock.name)).rejects.toThrow();
    });

    it('should return error if exception', async () => {
      jest.spyOn(categoryRepository, 'find').mockRejectedValue(new Error());
  
      expect(service.findCategoryByName(createCategoryMock.name)).rejects.toThrow();
    });
  });

  describe('Find category by id', () => {
    it('should return category by id', async () => {
      const category = await service.findCategoryById(categoryMock.id);
  
      expect(category).toEqual(categoryMock);
    });
  
    it('should return error if not found category by id', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);
  
      expect(service.findCategoryById(categoryMock.id)).rejects.toThrow();
    });

    it('should return error if exception', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockRejectedValue(new Error());
  
      expect(service.findCategoryById(categoryMock.id)).rejects.toThrow();
    });
  });

  describe('Create category', () => {
    it('should return category created', async () => {
      jest.spyOn(categoryRepository, 'find').mockResolvedValue([]);
  
      const category = await service.createCategory(createCategoryMock);
  
      expect(category).toEqual(categoryMock);
    });
  
    it('should return error in exception', async () => {
      jest.spyOn(categoryRepository, 'save').mockRejectedValue(new Error());
  
      expect(service.createCategory(createCategoryMock)).rejects.toThrow();
    });
  });
});
