import { Controller, Get } from '@nestjs/common';

import { StateService } from './state.service';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { ReturnStateDto } from './dtos/return-state.dto';

@Roles(UserType.Admin, UserType.User)
@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get()
  async getAllState(): Promise<ReturnStateDto[]> {
    return (await this.stateService.getAllState()).map(
      (state) => new ReturnStateDto(state)
    );
  };
}
