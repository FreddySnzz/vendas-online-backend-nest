import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProductDto {
  @IsNumber()
  categoryId: number;

  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsNumber()
  price: number;
}