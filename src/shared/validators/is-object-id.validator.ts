import * as mongoose from 'mongoose';

import {registerDecorator, ValidationOptions, ValidationArguments} from "class-validator";

export function IsObjectId(validationOptions?: ValidationOptions) {
   return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isObjectId",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                  try {
                    const id = mongoose.Types.ObjectId(value);
                    const idStr = id.toString();
                    return value === idStr;
                  } catch (e) {
                    return false;
                  }
                }
            }
        });
   };
}