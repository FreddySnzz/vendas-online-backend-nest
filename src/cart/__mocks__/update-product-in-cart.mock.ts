import { productMock } from '../../product/__mocks__/product.mock';
import { UpdateProductInCartDto } from '../dtos/update-product-cart.dto';

export const updateProductInCartMock: UpdateProductInCartDto = {
  productId: productMock.id,
  amount: 54638,
};