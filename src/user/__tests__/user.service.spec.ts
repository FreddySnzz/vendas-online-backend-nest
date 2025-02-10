import { Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { UserEntity } from "../entities/user.entity";
import { UserService } from "../user.service";
import { userEntityMock } from "../__mocks__/user.mock";
import { createUserMock } from "../__mocks__/create-user.mock";

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([userEntityMock]),
            findOne: jest.fn().mockResolvedValue(userEntityMock),
            save: jest.fn().mockResolvedValue(userEntityMock),
          }
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('Find user by email', () => {
    it('should return user in findUserByEmail', async () => {
      const userEmail = await service.findUserByEmail(userEntityMock.email);
  
      expect(userEmail).toEqual(userEntityMock);
    });
  
    it('should return error in findUserByEmail', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
  
      expect(service.findUserByEmail(userEntityMock.email)).rejects.toThrow();
    });
  
    it('should return error in findUserByEmail (error DB)', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());
  
      expect(service.findUserByEmail(userEntityMock.email)).rejects.toThrow();
    });
  });

  describe('Find user by id', () => {
    it('should return user in findUserById', async () => {
      const userId = await service.findUserById(userEntityMock.id);
  
      expect(userId).toEqual(userEntityMock);
    });
  
    it('should return error in findUserById', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
  
      expect(service.findUserById(userEntityMock.id)).rejects.toThrow();
    });
  
    it('should return error in findUserById (error DB)', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());
  
      expect(service.findUserById(userEntityMock.id)).rejects.toThrow();
    });
  });

  describe('Find all users', () => {
    it('should return all users', async () => {
      const users = await service.getAllUsers();
  
      expect(users).toEqual([userEntityMock]);
    });
  
    it('should return error in exception', async () => {
      jest.spyOn(userRepository, 'find').mockRejectedValueOnce(new Error());
      
      expect(service.getAllUsers()).rejects.toThrow();
    });
  });

  describe('Create user', () => {
    it('should return error if user already exists in createUser', async () => {
      expect(service.createUser(createUserMock)).rejects.toThrow();
    });
  
    it('should return user in createUser', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
  
      const user = await service.createUser(createUserMock);
  
      expect(user).toEqual(userEntityMock);
    });
  });
});