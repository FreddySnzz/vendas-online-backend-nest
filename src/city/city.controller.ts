import { Controller, Get, Param } from '@nestjs/common';

import { CityService } from './city.service';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';

@Roles(UserType.Admin, UserType.User)
@Controller('city')
export class CityController {
  constructor(
    private readonly cityService: CityService
  ) {}
  
  @Get('/:stateId')
  async getAllCitiesByStateId(@Param('stateId') stateId: number) {
    return this.cityService.getAllCitiesByStateId(stateId);
  };
}
