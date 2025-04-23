import { ReturnCategoryDto } from "../../category/dtos/return-category.dto";
import { ProductEntity } from "../entities/product.entity";

export class ReturnProductDto {
  id: number;
  imageUrl: string;
  name: string;
  description?: string;
  price: number;
  stockAmount: number;
  category?: ReturnCategoryDto;

  constructor(productEntity: ProductEntity) {
    this.id = productEntity.id;
    this.imageUrl = productEntity.imageUrl;
    this.name = productEntity.name;
    this.description = productEntity.description;
    this.price = productEntity.price;
    this.stockAmount = productEntity.stockAmount;
    this.category = productEntity.category 
    ? new ReturnCategoryDto(productEntity.category) 
    : undefined;
  }
}