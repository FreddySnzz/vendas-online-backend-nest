import { Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { AddressService } from "../address.service";
import { AddressEntity } from "../entities/address.entity";
import { addressMock } from "../__mocks__/address.mock";
import { UserService } from "../../user/user.service";
import { CityService } from "../../city/city.service";
import { userEntityMock } from "../../user/__mocks__/user.mock";
import { cityMock } from "../../city/__mocks__/city.mock";
import { createAddressMock } from "../__mocks__/createAddress.mock";

describe('AddressService', () => {
  let service: AddressService;
  let userService: UserService;
  let cityService: CityService;
  let addressRepository: Repository<AddressEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: UserService,
          useValue: {
            findUserById: jest.fn().mockResolvedValue(userEntityMock),
          }
        },
        {
          provide: CityService,
          useValue: {
            findCityById: jest.fn().mockResolvedValue(cityMock),
          }
        },
        {
          provide: getRepositoryToken(AddressEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(addressMock),
            find: jest.fn().mockResolvedValue([addressMock])
          }
        }
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    userService = module.get<UserService>(UserService);
    cityService = module.get<CityService>(CityService);
    addressRepository = module.get<Repository<AddressEntity>>(
      getRepositoryToken(AddressEntity)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(addressRepository).toBeDefined();
  });

  describe('Create address', () => {
    it('should return address after createAddress', async () => {
      const address = await service.createAddress(createAddressMock, userEntityMock.id);
  
      expect(address).toEqual(addressMock);
    });
  
    it('should return error if exception in userService', async () => {
      jest.spyOn(userService, 'findUserById').mockRejectedValue(new Error());
  
      expect(service.createAddress(createAddressMock, userEntityMock.id)).rejects.toThrow();
    });
  
    it('should return error if exception in cityService', async () => {
      jest.spyOn(cityService, 'findCityById').mockRejectedValue(new Error());
  
      expect(service.createAddress(createAddressMock, userEntityMock.id)).rejects.toThrow();
    });
  });

  describe('Find all addresses by user id', () => {
    it('should return all address by user id', async () => {
      const addresses = await service.findAllAddressesByUserId(userEntityMock.id);
  
      expect(addresses).toEqual([addressMock])
    });
  
    it('should return not found if no address found', async () => {
      jest.spyOn(addressRepository, 'find').mockResolvedValue(undefined);
  
      expect(service.findAllAddressesByUserId(userEntityMock.id)).rejects.toThrow();
    });
  });
});