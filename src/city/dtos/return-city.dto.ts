import { ReturnStateDto } from "../../state/dtos/return-state.dto";
import { CityEntity } from "../entities/city.entity";

export class ReturnCityDto {
  id: number;
  name: string;
  state?: ReturnStateDto;

  constructor(city: CityEntity) {
    this.id = city.id;
    this.name = city.name;
    this.state = city.state 
      ? new ReturnStateDto(city.state) 
      : undefined;
  };
}