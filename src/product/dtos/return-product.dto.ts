import { ProductEntity } from "../entities/product.entity";

export class ReturnProductDto {
  id: number;
  image: string;
  name: string;
  price: number;

  constructor(productEntity: ProductEntity) {
    this.id = productEntity.id;
    this.image = productEntity.image;
    this.name = productEntity.name;
    this.price = productEntity.price;
  }
}