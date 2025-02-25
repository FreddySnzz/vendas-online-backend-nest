import { Body, Controller, Get, Headers, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { ReturnUserDto } from './dtos/return-user.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from './enum/user-type.enum';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { UserId } from '../decorators/user-id.decorator';

@Roles(UserType.Admin, UserType.User)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserType.Admin)
  @Get()
  async getAllUsers(): Promise<ReturnUserDto[]> {
    return (await this.userService.getAllUsers()).map(
      userEntity => new ReturnUserDto(userEntity),
    );
  };

  @Get('/:userId')
  async findUserById(@Param('userId') userId: number): Promise<ReturnUserDto> {
    return new ReturnUserDto(await this.userService.findUserById(userId));
  };

  @UsePipes(ValidationPipe)
  @Post()
  async createUser(@Body() createUser: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(createUser);
  };

  @UsePipes(ValidationPipe)
  @Patch()
  async updatePassword(
    @UserId() userId: number,
    @Body() updatePasswordDto: UpdatePasswordDto
  ): Promise<ReturnUserDto> {
    return new ReturnUserDto(await this.userService.updatePassword(userId, updatePasswordDto));
  };
}