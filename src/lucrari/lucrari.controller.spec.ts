import { Test, TestingModule } from '@nestjs/testing';
import { LucrariController } from './lucrari.controller';

describe('LucrariController', () => {
  let controller: LucrariController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LucrariController],
    }).compile();

    controller = module.get<LucrariController>(LucrariController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
