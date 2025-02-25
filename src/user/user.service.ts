import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';

import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserType } from './enum/user-type.enum';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { createPasswordHashed, validatePassword } from '../utils/password';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {};

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.findUserByEmail(
      createUserDto.email
    ).catch(() => undefined);

    if (user) {
      throw new NotAcceptableException(`Email already exists`);
    };

    const passwordHashed = await createPasswordHashed(createUserDto.password);

    return this.userRepository.save({
      ...createUserDto,
      typeUser: UserType.User,
      password: passwordHashed
    });
  };

  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find({
      relations: {
        addresses: {
          city: {
            state: true
          }
        }
      }
    });
  };

  async findUserById(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId
      },
      relations: {
        addresses: {
          city: {
            state: true
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException(`UserId: ${userId} not found`);
    };

    return user;
  };

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email
      }
    });

    if (!user) {
      throw new NotFoundException(`Email: ${email} not found`);
    };

    return user;
  };

  async updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto): Promise<UserEntity> {
    const user = await this.findUserById(userId);

    if (updatePasswordDto.newPassword === updatePasswordDto.oldPassword) {
      throw new BadRequestException(`Passwords cannot be the same`);
    };

    const isMatch = await validatePassword(updatePasswordDto.oldPassword, user.password);

    if (!isMatch) {
      throw new BadRequestException(`Passwords do not match`);
    };

    const passwordHashed = await createPasswordHashed(updatePasswordDto.newPassword);

    await this.userRepository.save({
      ...user,
      password: passwordHashed
    });

    return user;
  };
}
