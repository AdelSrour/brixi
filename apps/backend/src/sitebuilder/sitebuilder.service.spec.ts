import { Test, TestingModule } from '@nestjs/testing';
import { SitebuilderService } from './sitebuilder.service';

describe('SitebuilderService', () => {
  let service: SitebuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SitebuilderService],
    }).compile();

    service = module.get<SitebuilderService>(SitebuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
