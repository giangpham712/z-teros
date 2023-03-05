import * as fs from 'fs';
import { Controller, Post, Body, ForbiddenException, Get, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { CreatePrivilegeDto } from './dto/create-privilege.dto';
import { PrivilegeRO } from './response-object/privilege.ro';
import { PrivilegeService } from './privilege.service';
import { ApiResponse } from '../../shared/types/api-response';

import { ApiBearerAuth, ApiImplicitParam, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { User } from '@bn-decorator/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRO } from './response-object/user.ro';
import { PrivilegeUsersRO } from './response-object/privilege-users.ro';
import { UpdatePrivilegeDto } from './dto/update-privilege.dto';
import { PermissionGuard } from '@bn-guard/permission.guard';
import { Permissions } from '@bn-decorator/permission.decorator';
import { UserRole } from '@bn-enum/user-role.enum';

const listHtml = fs.readFileSync('swagger/privilege/list.html', 'utf8');
const createHtml = fs.readFileSync('swagger/privilege/create.html', 'utf8');
const updateHtml = fs.readFileSync('swagger/privilege/update.html', 'utf8');
const deleteHtml = fs.readFileSync('swagger/privilege/delete.html', 'utf8');
const listUsersHtml = fs.readFileSync('swagger/privilege/list-users.html', 'utf8');

@Controller('privileges')
@ApiUseTags('Privileges')
export class PrivilegeController {
  constructor(private readonly privilegeService: PrivilegeService) {}

  @ApiOperation({
    title: 'Get Privileges',
    description: listHtml,
  })
  @Get('')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async listAllPrivileges(): Promise<PrivilegeRO[]> {
    return await this.privilegeService.listAll();
  }

  @ApiOperation({
    title: 'Get Users Associated With A Privilege',
    description: listUsersHtml,
  })
  @ApiImplicitParam({ name: 'id' })
  @Get(':id/users')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async listUsers(@Param('id') privilegeId): Promise<PrivilegeUsersRO> {
    return this.privilegeService.listUsers(privilegeId);
  }

  @ApiOperation({
    title: 'Create A Privilege',
    description: createHtml,
  })
  @Post('')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Permissions(UserRole.User)
  @ApiBearerAuth()
  async create(@User() user, @Body() createPrivilegeDto: CreatePrivilegeDto): Promise<PrivilegeRO> {
    return await this.privilegeService.create(user, createPrivilegeDto);
  }

  @ApiOperation({
    title: 'Update A Privilege',
    description: updateHtml,
  })
  @ApiImplicitParam({ name: 'id' })
  @Put(':id')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Permissions(UserRole.User)
  @ApiBearerAuth()
  async update(@User() user, @Param('id') updatePrivilegeId, @Body() updatePrivilegeDto: UpdatePrivilegeDto): Promise<PrivilegeRO> {
    return await this.privilegeService.update(user, updatePrivilegeId, updatePrivilegeDto);
  }

  @ApiOperation({
    title: 'Delete A Privilege',
    description: deleteHtml,
  })
  @ApiImplicitParam({ name: 'id' })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Permissions(UserRole.User)
  @ApiBearerAuth()
  async delete(@User() user, @Param('id') deletePrivilegeId) {
    return await this.privilegeService.delete(user, deletePrivilegeId);
  }
}
