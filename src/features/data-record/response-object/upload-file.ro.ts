import { FolderDto } from "../dto/folder.dto";
import { PrivilegeDto } from "../dto/privilege.dto";

export interface UploadFileRO {
  id: string;
  name: string;
  parent: FolderDto;
  privilege: PrivilegeDto;
}
