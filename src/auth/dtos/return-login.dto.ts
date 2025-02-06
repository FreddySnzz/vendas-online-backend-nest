import { ReturnUserDto } from "../../user/dtos/return-user.dto";

export class ReturnLoginDto {
  user: ReturnUserDto;
  accessToken: string;
}