import { Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { CityService } from "../city.service";
import { CityEntity } from "../entities/city.entity";
import { cityMock } from "../__mocks__/city.mock";
import { CacheService } from "../../cache/cache.service";

describe('CityService', () => {
  let service: CityService;
  let cityRepository: Repository<CityEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        {
          provide: CacheService,
          useValue: {
            getCache: jest.fn().mockResolvedValue([cityMock]),
          }
        },
        {
          provide: getRepositoryToken(CityEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(cityMock),
          }
        }
      ],
    }).compile();

    service = module.get<CityService>(CityService);
    cityRepository = module.get<Repository<CityEntity>>(
      getRepositoryToken(CityEntity)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cityRepository).toBeDefined();
  });

  describe('Find city by id', () => {
    it('should return findCityById', async () => {
      const city = await service.findCityById(cityMock.id);
  
      expect(city).toEqual(cityMock);
    });
  
    it('should return error findCityById not found', async () => {
      jest.spyOn(cityRepository, 'findOne').mockResolvedValueOnce(undefined);
  
      expect(service.findCityById(cityMock.id)).rejects.toThrow();
    });
  });

  describe('Find all cities by state id', () => {
    it('should return getAllCitiesByStateId', async () => {
      const cities = await service.getAllCitiesByStateId(cityMock.stateId);
  
      expect(cities).toEqual([cityMock]);
    });
  });
});