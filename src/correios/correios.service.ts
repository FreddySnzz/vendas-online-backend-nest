import { 
  BadRequestException, 
  Injectable, 
  NotFoundException 
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';

import { ReturnCepExternalDto } from './dtos/return-cep-external.dto';
import { CityService } from '../city/city.service';
import { ReturnCepDto } from './dtos/return-cep.dto';
import { CityEntity } from 'src/city/entities/city.entity';

@Injectable()
export class CorreiosService {
  constructor(
    private readonly httpService: HttpService,
    private readonly cityService: CityService
  ) {}

  URL_CEP = process.env.URL_CEP_CORREIOS;

  async findAddressByCep(
    cep: string
  ): Promise<ReturnCepDto> {
    const returnCep: ReturnCepExternalDto = await this.httpService.axiosRef
      .get<ReturnCepExternalDto>(this.URL_CEP.replace('{CEP}', cep))
      .then((result) => {
        if (result.data.erro === 'true') {
          throw new NotFoundException(`CEP not found`);
        };

        return result.data;
      })
      .catch((error: AxiosError) => {
        throw new BadRequestException(
          `Error in connection request: ${error.message}`
        );
      });

    const city: CityEntity | undefined = await this.cityService.findCityByName(
      returnCep.localidade, 
      returnCep.uf
    ).catch(() => undefined);

    return new ReturnCepDto(
      returnCep, 
      city?.id, 
      city?.stateId
    );
  };
}
