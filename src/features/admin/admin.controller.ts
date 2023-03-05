import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

@Controller()
@ApiUseTags('log')
export class AdminController {
  constructor() {}
}
