import * as fs from 'fs';
import { Body, Controller, Delete, Param, Post, UseGuards, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiUseTags, ApiImplicitQuery, ApiImplicitParam } from '@nestjs/swagger';
import { CreateFolderDto } from './dto/create-folder.dto';
import { DataRecordService } from './services/data-record.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateFolderRO } from './response-object/create-folder.ro';

const listRootHtml = fs.readFileSync('swagger/folder/list-root.html', 'utf8');
const listChildrenByIdHtml = fs.readFileSync('swagger/folder/list-children-by-id.html', 'utf8');
const listChildrenByPathHtml = fs.readFileSync('swagger/folder/list-children-by-path.html', 'utf8');
const createHtml = fs.readFileSync('swagger/folder/create.html', 'utf8');
const deleteHtml = fs.readFileSync('swagger/folder/delete.html', 'utf8');

@Controller('folders')
@ApiUseTags('Folder Management')
export class FolderController {
  constructor(
    private readonly dataRecordService: DataRecordService,
  ) {}

  @ApiOperation({ 
    title: 'Create New Folder',
    description: createHtml,
  })
  @Post('')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async createFolder(@Body() createFolderDto: CreateFolderDto): Promise<CreateFolderRO> {
    return await this.dataRecordService.createFolder(createFolderDto);
  }

  @ApiOperation({ 
    title: 'Delete A Folder',
    description: deleteHtml
  })
  @ApiImplicitParam({ name: 'id' })
  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async deleteFolderById(@Param('id') folderId): Promise<void> {
    await this.dataRecordService.deleteFolderById(folderId);
  }

  @ApiOperation({ 
    title: 'List Root Children',
    description: listRootHtml
  })
  @Get('root/children')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async listRootChildren() {
    return await this.dataRecordService.listFolderChildren(null);
  }

  @ApiOperation({ 
    title: 'List Children For A Folder By Id',
    description: listChildrenByIdHtml
  })
  @ApiImplicitParam({ name: 'id' })
  @Get(':id/children')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async listFolderChildren(@Param('id') folderId) {
    return await this.dataRecordService.listFolderChildren({ id: folderId, path: null});
  }

  @ApiOperation({ 
    title: 'List Children For A Folder By Path',
    description: listChildrenByPathHtml,
  })
  @ApiImplicitQuery({
		name: 'path',
		description: 'Path of parent folder',
		required: false,
		type: String
	})
  @Get('children')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async listFolderChildrenByPath(@Query('path') path) {
    return await this.dataRecordService.listFolderChildren({ id: null, path: path});
  }
}
