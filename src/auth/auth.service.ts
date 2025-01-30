import { Injectable, NotFoundException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/user/user.service';
import { LoginDto } from './dtos/login.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { ReturnLoginDto } from './dtos/returnLogin.dto';
import { ReturnUserDto } from 'src/user/dtos/returnUser.dto';
import { LoginPayloadDto } from './dtos/loginPayload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto): Promise<ReturnLoginDto> {
    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(loginDto.email)
      .catch(() => undefined);

    const isMatch = await compare(loginDto.password, user?.password || '');

    if (!isMatch || !user) {
      throw new NotFoundException('Email or password invalid');
    };

    return {
      accessToken: this.jwtService.sign({ ...new LoginPayloadDto(user) }),
      user: new ReturnUserDto(user),
    };
  };
}
