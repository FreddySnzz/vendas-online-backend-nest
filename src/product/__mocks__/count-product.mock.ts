import { categoryMock } from '../../category/__mocks__/category.mock';
import { CountProductDto } from '../dtos/count-product.dto';

export const countProductMock: CountProductDto = {
  categoryId: categoryMock.id,
  total: 4
};