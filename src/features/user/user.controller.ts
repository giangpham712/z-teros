import * as fs from 'fs';
import { Body, Controller, Delete, Get, Param, Put, UseGuards, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiImplicitParam, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { User } from '@bn-decorator/user.decorator';
import { UserService } from './services/user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Permissions } from '@bn-decorator/permission.decorator';
import { UserRole } from '@bn-enum/user-role.enum';
import { ApiResponse } from '../../shared/types/api-response';
import { UserRO } from './response-object/user.ro';
import { PermissionGuard } from '@bn-guard/permission.guard';

const listHtml = fs.readFileSync('swagger/user/list.html', 'utf8');
const updateHtml = fs.readFileSync('swagger/user/update.html', 'utf8');
const deleteHtml = fs.readFileSync('swagger/user/delete.html', 'utf8');

@Controller('users')
@ApiUseTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @ApiOperation({ 
    title: ' List Users',
    description: listHtml
  })
  @Get('')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async viewAllUser(@User() user): Promise<UserRO[]> {
    return await this.userService.getAllUser();
  }

  @ApiOperation({ 
    title: 'Update User Profile',
    description: updateHtml
  })
  @Put('profile')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async editProfile(@User() user, @Body() updateProfileDto: UpdateProfileDto) {
    return await this.userService.updateUser(user.id, updateProfileDto);
  }

  @ApiOperation({ 
    title: 'Delete User',
    description: deleteHtml
  })
  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuard(), PermissionGuard)
  @ApiBearerAuth()
  @Permissions(UserRole.Admin)
  @ApiImplicitParam({ name: 'id' })
  async deleteUser(@User() admin, @Param('id') deleteUserId): Promise<ApiResponse> {
    await this.userService.deleteUser(admin, deleteUserId);
    return null;
  }
}
