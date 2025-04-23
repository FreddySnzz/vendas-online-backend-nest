import { ReturnCategoryDto } from "../../category/dtos/return-category.dto";
import { ProductEntity } from "../entities/product.entity";

export class ReturnProductDto {
  id: number;
  image: string;
  name: string;
  price: number;
  category?: ReturnCategoryDto;

  constructor(productEntity: ProductEntity) {
    this.id = productEntity.id;
    this.image = productEntity.image;
    this.name = productEntity.name;
    this.price = productEntity.price;
    this.category = productEntity.category 
    ? new ReturnCategoryDto(productEntity.category) 
    : undefined;
  }
}