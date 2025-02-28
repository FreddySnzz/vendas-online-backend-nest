import { Test, TestingModule } from '@nestjs/testing';
import { PaymentStatusService } from '../payment-status.service';
import { PaymentStatusEntity } from '../entities/payment-status.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PaymentStatusService', () => {
  let service: PaymentStatusService;
  let paymentStatusRepository: Repository<PaymentStatusEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentStatusService,
        {
          provide: getRepositoryToken(PaymentStatusEntity),
          useValue: {

          },
        }
      ],
    }).compile();

    service = module.get<PaymentStatusService>(PaymentStatusService);
    paymentStatusRepository = module.get<Repository<PaymentStatusEntity>>(
      getRepositoryToken(PaymentStatusEntity)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(paymentStatusRepository).toBeDefined();
  });
});
