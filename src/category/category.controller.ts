import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Post, 
  Query, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

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
    return this.categoryService.getAllCategories();
  };

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async createCategory(
    @Body() createCategory: CreateCategoryDto
  ): Promise <CategoryEntity> {
    return await this.categoryService.createCategory(createCategory);
  };

  @Get('search')
  async findCategoryByName(
    @Query('category_name') categoryName: string
  ): Promise<ReturnCategoryDto[]> {
    return (await this.categoryService.findCategoryByName(categoryName)).map(
      categories => new ReturnCategoryDto(categories)
    );
  };

  @Get('/:id')
  async findCategoryById(
    @Param('id') id: number
  ): Promise<ReturnCategoryDto> {
    return await this.categoryService.findCategoryById(id);
  };

  @Roles(UserType.Admin)
  @Delete('/:categoryId')
  async deleteCategoryById(
    @Param('categoryId') categoryId: number
  ): Promise<DeleteResult> {
    return await this.categoryService.deleteCategoryById(categoryId);
  };
}
