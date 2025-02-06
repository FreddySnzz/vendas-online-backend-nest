import { CreateUserDto } from "../dtos/create-user.dto";

export const createUserMock: CreateUserDto = {
  name: 'Create User Test',
  email: 'createuser@mail.com',
  cpf: '12345678910',
  phone: '12345678910',
  password: 'largePassword',
}