import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';

import { CategoryService } from './category.service';
import { ReturnCategoryDto } from './dtos/return-category.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Roles(UserType.User, UserType.Admin)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories(): Promise<ReturnCategoryDto[]> {
    return (await this.categoryService.getAllCategories()).map(
      categories => new ReturnCategoryDto(categories)
    );
  };

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async createCategory(
    @Body() createCategory: CreateCategoryDto
  ): Promise <CategoryEntity> {
    return await this.categoryService.createCategory(createCategory);
  };

  @Get('/:categoryName')
  async findCategoryByName(
    @Param('categoryName') categoryName: string
  ): Promise<ReturnCategoryDto> {
    return await this.categoryService.findCategoryByName(categoryName);
  };
}
