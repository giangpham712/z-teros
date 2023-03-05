import * as fs from 'fs';
import { Body, Controller, Post, UseGuards, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiUseTags } from '@nestjs/swagger';

import { AuthService } from './services/auth.service';
import { CreateUserDto, RequestTokenDto } from './dto';
import { ValidateRO } from './response-object/validate.ro';
import { Permissions } from '@bn-decorator/permission.decorator';
import { UserRole } from '@bn-enum/user-role.enum';
import { ApiResponse } from '../../shared/types/api-response';
import { CreateUserRO } from './response-object/create-user.ro';
import { User } from '@bn-decorator/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from '@bn-guard/permission.guard';

const loginHtml = fs.readFileSync('swagger/auth/login.html', 'utf8');
const registerHtml = fs.readFileSync('swagger/auth/register.html', 'utf8');

@Controller()
@ApiUseTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @ApiOperation({
    title: 'Login',
    description: loginHtml,
  })
  @Post('auth/login')
  async requestToken(@Body() requestTokenDto: RequestTokenDto): Promise<ValidateRO> {
    return await this.authService.validateUser(requestTokenDto);
  }

  @ApiOperation({
    title: 'Register',
    description: registerHtml,
  })
  @Post('auth/register')
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Permissions(UserRole.Admin)
  @ApiBearerAuth()
  async createUser(@User() admin, @Body() createUserDto: CreateUserDto): Promise<CreateUserRO> {
    return await this.authService.createUser(admin, createUserDto);
  }
}
