import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { CorreiosService } from './correios.service';
import { CorreiosController } from './correios.controller';
import { CityModule } from '../city/city.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    CityModule
  ],
  providers: [CorreiosService],
  controllers: [CorreiosController]
})
export class CorreiosModule {}
