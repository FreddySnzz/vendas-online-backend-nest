import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProductDto {
  @IsNumber()
  categoryId: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  stockAmount: number;

  @IsString()
  imageUrl: string;

  @IsNumber()
  price: number;
}