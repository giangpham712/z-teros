import * as mongoose from 'mongoose';
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, NotFoundException } from '@nestjs/common';

export class ObjectIdValidationPipe implements PipeTransform<any> {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!(metadata.type === 'param' && metadata.data === 'id')) {
      return value;  
    }
    
    if (this.validateObjectId(value)) {
      return value;
    }

    throw new NotFoundException();
  }

  private validateObjectId(objectId: string): boolean {
    try {
      const id = mongoose.Types.ObjectId(objectId);
      const idStr = id.toString();
      return objectId === idStr;
    } catch (e) {
      return false;
    }
  }
}