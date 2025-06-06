import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CityEntity } from './entities/city.entity';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    private readonly cacheService: CacheService,
  ) {};

  async getAllCitiesByStateId(
    stateId: number
  ): Promise<CityEntity[]> {
    return this.cacheService.getCache<CityEntity[]>(`state_${stateId}`, 
      () => this.cityRepository.find({ 
        where: { 
          stateId 
        },
        relations: {
          state: true
        }
      })
    );
  };

  async findCityById(
    cityId: number
  ): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({
      where: {
        id: cityId
      },
    });
    
    if (!city) {
      throw new NotFoundException(`CityId: ${cityId} not found`);
    };

    return city;
  };

  async findCityByName(
    cityName: string,
    stateUf: string
  ): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({
      where: {
        name: cityName,
        state: {
          uf: stateUf
        }
      },
      relations: {
        state: true
      }
    });

    if (!city) {
      throw new NotFoundException(`City not found`);
    };

    return city;
  };
}
