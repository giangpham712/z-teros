import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

interface MsgError {
  message: any;
}

const messageFormatter = (exception) => {
  switch (exception.constructor) {
    case BadRequestException:
      return exception.message.message;
    case ForbiddenException:
      return exception.message.message || `You don't have permission to perform this operation`;
    case Error:
      return exception.message;
    default:
      return (exception as MsgError).message
        ? (exception as MsgError).message
        : 'Unknown Error';
  }
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const message = messageFormatter(exception);

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      errorMessage: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
