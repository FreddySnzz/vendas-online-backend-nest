import { productMock } from "../../product/__mocks__/product.mock";
import { InsertProductInCartDto } from "../dtos/insert-product-cart.dto";

export const insertProductInCartMock: InsertProductInCartDto = {
  productId: productMock.id,
  amount: 3
}