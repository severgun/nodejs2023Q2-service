import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpAdapterHost,
  HttpStatus,
} from '@nestjs/common';
import { LoggingService } from 'src/logging/logging.service';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(
    private httpAdapterHost: HttpAdapterHost,
    private readonly logger: LoggingService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      message = exception.message;
    }

    const responseBody = {
      statusCode: httpStatus,
      message: message,
    };

    this.logger.error(`${httpStatus}, ${message}`, '', 'ExceptionFilter');

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
