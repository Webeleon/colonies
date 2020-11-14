import { Test, TestingModule } from '@nestjs/testing';
import { RaidHandler } from './raid.handler';

describe('RaidHandler', () => {
  let service: RaidHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RaidHandler],
    }).compile();

    service = module.get<RaidHandler>(RaidHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should respond to `colonie raid @player', () => {
    expect(service.test('colonie raid <@!123123123>')).toBeTruthy();
    expect(service.test('colonie RAId <@!123123>')).toBeTruthy();
    expect(service.test('exemple colonie raid <@!12312312>')).toBeFalsy();
  });
});
