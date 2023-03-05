import { FolderDto } from "../dto/folder.dto";

export interface CreateFolderRO {
  id: string;
  name: string;
  parent: FolderDto;
}
