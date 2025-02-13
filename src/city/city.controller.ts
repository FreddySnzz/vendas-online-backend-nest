import { Controller, Get, Param } from '@nestjs/common';

import { CityService } from './city.service';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from 'src/user/enum/user-type.enum';

@Roles(UserType.Admin, UserType.User)
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}
  
  @Get('/:stateId')
  async getAllCitiesByStateId(@Param('stateId') stateId: number) {
    return this.cityService.getAllCitiesByStateId(stateId);
  };
}
