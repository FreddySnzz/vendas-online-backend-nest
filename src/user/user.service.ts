import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dtos/createUser.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {};

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const saltOrRounds = 10;
    const passwordHashed = await hash(createUserDto.password, saltOrRounds);

    return this.userRepository.save({
      ...createUserDto,
      typeUser: 1,
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
}
