import { Test, TestingModule } from '@nestjs/testing';

import { CorreiosController } from '../correios.controller';
import { CorreiosService } from '../correios.service';
import { returnCepMock } from '../__mocks__/return-cep.mock';

describe('CorreiosController', () => {
  let controller: CorreiosController;
  let correiosService: CorreiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CorreiosService,
          useValue: {
            findAddressByCep: jest.fn().mockResolvedValue([returnCepMock])
          }
        }
      ],
      controllers: [
        CorreiosController
      ],
    }).compile();

    controller = module.get<CorreiosController>(CorreiosController);
    correiosService = module.get<CorreiosService>(CorreiosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(correiosService).toBeDefined();
  });
});
