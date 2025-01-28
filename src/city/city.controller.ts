import { Controller, Get, Param } from '@nestjs/common';

import { CityService } from './city.service';


@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}
  
  @Get('/:stateId')
  async getAllCitiesByStateId(@Param('stateId') stateId: number) {
    return this.cityService.getAllCitiesByStateId(stateId);
  };
}
