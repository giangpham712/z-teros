import { FolderDto } from "../dto/folder.dto";
import { PrivilegeDto } from "../dto/privilege.dto";

export interface FileRO {
  id: string;
  name: string;
  mimeType: string;
  parent: FolderDto;
  privilege: PrivilegeDto;
}
