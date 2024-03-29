import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggingService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { method, query, baseUrl, body } = req;

    this.logger.log(
      `${method}: ` +
        `BaseUrl: ${baseUrl}, ` +
        `Query: ${JSON.stringify(query)}, ` +
        `Body: ${JSON.stringify(body)}`,
      'HttpRequest',
    );

    res.on('finish', () => {
      const { statusCode, statusMessage } = res;
      this.logger.log(
        `${statusCode} ` +
          `${statusMessage}, ` +
          `(${method}: ` +
          `BaseUrl: ${baseUrl}, ` +
          `Query: ${JSON.stringify(query)}, ` +
          `Body: ${JSON.stringify(body)})`,
        'HttpResponse',
      );
    });

    next();
  }
}
