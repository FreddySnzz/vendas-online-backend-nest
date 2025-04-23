import { ReturnCepExternalDto } from "./return-cep-external.dto";

export class ReturnCepDto {
  cep: string;
  street: string;
  complement: string;
  neighborhood: string;
  city: string;
  uf: string;
  ddd: string;
  cityId?: number;
  stateId?: number;

  constructor(cep: ReturnCepExternalDto, cityId?: number, stateId?: number) {
    this.cep = cep.cep;
    this.street = cep.logradouro;
    this.complement = cep.complemento;
    this.neighborhood = cep.bairro;
    this.city = cep.localidade;
    this.uf = cep.uf;
    this.ddd = cep.ddd;
    this.cityId = cityId;
    this.stateId = stateId;
  }
}