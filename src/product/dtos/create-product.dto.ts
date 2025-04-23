import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
  @IsNumber()
  categoryId: number;

  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsNumber()
  price: number;
}