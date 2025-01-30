import { ReturnStateDto } from "src/state/dtos/returnState.dto";

export class ReturnCityDto {
  name: string;
  state?: ReturnStateDto;

  constructor(city: ReturnCityDto) {
    this.name = city.name;
    this.state = city.state ? new ReturnCityDto(city.state) : undefined;
  };
}