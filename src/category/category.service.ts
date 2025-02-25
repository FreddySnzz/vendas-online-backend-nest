import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { toCapitalized } from '../utils/capitalize-words';

@Injectable()
export class CategoryService {

  constructor (
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
  ) {}

  async getAllCategories(): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepository.find();

    if (!categories || categories.length === 0) {
      throw new NotFoundException(`Categories empty`);
    };

    return categories;
  };

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const category = await this.findCategoryByName(createCategoryDto.name).catch(() => undefined);

    if (category) {
      throw new BadRequestException(`Category: ${createCategoryDto.name} already exists`);
    };

    return await this.categoryRepository.save(createCategoryDto);
  };

  async findCategoryByName(name: string): Promise<CategoryEntity[]> {
    const category = await this.categoryRepository.find({
      where: {
        name: Like(`%${toCapitalized(name)}%`)
      }
    });

    if (!category || category.length === 0) {
      throw new NotFoundException(`Category ${name} not found`);
    };

    return category;
  };

  async findCategoryById(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {
        id
      }
    });

    if (!category) {
      throw new NotFoundException(`Category ID: ${id} not found`);
    };

    return category;
  };
}
