import { UserEntity } from "../../user/entities/user.entity";

export class ReturnLoginDto {
  email: string;
  role: string;
  accessToken: string;

  constructor (userEntity: UserEntity) {
    this.email = userEntity.email;
    this.role = userEntity.typeUser === 1 ? "User" : "Admin"
  };
}