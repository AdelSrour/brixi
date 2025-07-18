import { Test, TestingModule } from '@nestjs/testing';
import { SitebuilderController } from './sitebuilder.controller';

describe('SitebuilderController', () => {
  let controller: SitebuilderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SitebuilderController],
    }).compile();

    controller = module.get<SitebuilderController>(SitebuilderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
