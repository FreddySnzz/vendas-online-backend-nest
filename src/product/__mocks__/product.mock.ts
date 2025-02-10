import { categoryMock } from "../../category/__mocks__/category.mock";
import { ProductEntity } from "../entities/product.entity";

export const productMock: ProductEntity = {
  categoryId: categoryMock.id,
  id: 1,
  image: "http://image.com",
  name: "Alice no país das maravilhas",
  price: 34.99,
  createdAt: new Date(),
  updatedAt: new Date()
}