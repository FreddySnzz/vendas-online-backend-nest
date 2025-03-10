import { ReturnAddressDto } from "../../address/dto/return-address.dto";
import { UserEntity } from "../entities/user.entity";

export class ReturnUserDto {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  addresses?: ReturnAddressDto[];

  constructor(userEntity: UserEntity) {
    this.id = userEntity.id;
    this.name = userEntity.name;
    this.email = userEntity.email;
    this.cpf = userEntity.cpf;
    this.phone = userEntity.phone;
    this.addresses = userEntity.addresses 
    ? userEntity.addresses.map((address) => new ReturnAddressDto(address)) 
    : undefined;
  };
}