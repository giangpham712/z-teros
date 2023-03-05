import { Test, TestingModule } from '@nestjs/testing';
import { PrivilegeController } from './privilege.controller';


describe('Privileges Controller', () => {
  let controller: PrivilegeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivilegeController],
    }).compile();

    controller = module.get<PrivilegeController>(PrivilegeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
