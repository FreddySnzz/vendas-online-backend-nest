import { UserEntity } from "../entities/user.entity";
import { UserType } from "../enum/user-type.enum";

export const userEntityMock: UserEntity = {
  id: 1,
  name: 'User Test',
  email: 'email@mail.com',
  cpf: '12345678910',
  typeUser: UserType.User,
  phone: '12345678910',
  password: '$2a$10$lLZvPziRS7HBw3aQtuD1IOu9yc0AxTEj.L.W1nC0wA5iiVvsQ/vMS',
  createdAt: new Date(),
  updatedAt: new Date(),
  addresses: [],
}