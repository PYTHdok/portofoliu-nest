import { Test, TestingModule } from '@nestjs/testing';
import { LucrariService } from './lucrari.service';

describe('LucrariService', () => {
  let service: LucrariService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LucrariService],
    }).compile();

    service = module.get<LucrariService>(LucrariService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
