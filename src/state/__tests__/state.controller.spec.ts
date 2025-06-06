import { Test, TestingModule } from '@nestjs/testing';

import { stateMock } from '../__mocks__/state.mock';
import { StateController } from '../state.controller';
import { StateService } from '../state.service';

describe('StateController', () => {
  let controller: StateController;
  let stateService: StateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: StateService,
          useValue: {
            getAllState: jest.fn().mockResolvedValue([stateMock])
          },
        },
      ],
      controllers: [StateController],
    }).compile();

    controller = module.get<StateController>(StateController);
    stateService = module.get<StateService>(StateService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(stateService).toBeDefined();
  });

  it('Get All States', async () => {
    const states = await controller.getAllState();

    expect(states).toEqual([{
      id: stateMock.id,
      name: stateMock.name,
      uf: stateMock.uf,
    }]);
  });
});