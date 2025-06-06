import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';

import { AddressService } from './address.service';
import { AddressEntity } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { UserId } from '../decorators/user-id.decorator';
import { ReturnAddressDto } from './dto/return-address.dto';

@Roles(UserType.User, UserType.Admin)
@Controller('address')
export class AddressController {

  constructor(
    private readonly addressService: AddressService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createAddress(
    @Body() createAddressDto: CreateAddressDto,
    @UserId() userId: number,
  ): Promise<AddressEntity> {
    return await this.addressService.createAddress(createAddressDto, userId);
  };

  @Get()
  async findAllAddressesByUserId(
    @UserId() userId: number,
  ): Promise<ReturnAddressDto[]> {
    return (await this.addressService.findAllAddressesByUserId(userId)).map(
      addresses => new ReturnAddressDto(addresses)
    );
  };
}
