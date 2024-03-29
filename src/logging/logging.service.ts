import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';

@Injectable()
export class LoggingService extends ConsoleLogger {
  log(message: any, context?: string) {
    super.log(message, context);
  }

  error(message: any, stack?: string, context?: string) {
    super.error(message, stack, context);
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
  }

  debug(message: any, context?: string) {
    super.debug(message, context);
  }

  verbose(message: any, context?: string) {
    super.verbose(message, context);
  }

  setLogLevels(levels: LogLevel[]): void {
    super.setLogLevels(levels);
  }
}
