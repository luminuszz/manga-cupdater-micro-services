import { Status } from '@app/entities/document.entitiy';

export class UpdateToReadDocumentStatusDto {
  id: string;
  status: Status;
}
