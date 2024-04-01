import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

enum BYTES_MULTIPLIER {
  KILOBYTE = 1024,
  MEGABYTE = 1024 * 1024,
  GIGABYTE = 1024 * 1024 * 1024,
  TERABYTE = 1024 * 1024 * 1024 * 1024,
}

@Injectable()
export class LoggingService extends ConsoleLogger {
  private logFile: fs.FileHandle;
  private errLogFile: fs.FileHandle;
  private logFileSize = 0;
  private errLogFileSize = 0;
  private logFileSizeLimit: number;
  private errLogFileSizeLimit: number;

  constructor() {
    super();

    const logFilePath = process.env.LOG_FILE_PATH || 'log.txt';
    this.initLogFile(logFilePath);

    const errLogFilePath = process.env.ERROR_LOG_FILE_PATH || 'errlog.txt';
    this.initErrLogFile(errLogFilePath);

    this.logFileSizeLimit = this.parseBytes(process.env.LOG_FILE_SIZE);
    this.errLogFileSizeLimit = this.parseBytes(process.env.ERROR_LOG_FILE_SIZE);
  }

  private parseBytes(size: string): number {
    const lowerCaseSizeStr = size.toLowerCase();
    if (lowerCaseSizeStr.endsWith('k') || lowerCaseSizeStr.endsWith('kb')) {
      return Number.parseInt(lowerCaseSizeStr) * BYTES_MULTIPLIER.KILOBYTE;
    }

    if (lowerCaseSizeStr.endsWith('m') || lowerCaseSizeStr.endsWith('mb')) {
      return Number.parseInt(lowerCaseSizeStr) * BYTES_MULTIPLIER.MEGABYTE;
    }

    if (lowerCaseSizeStr.endsWith('g') || lowerCaseSizeStr.endsWith('gb')) {
      return Number.parseInt(lowerCaseSizeStr) * BYTES_MULTIPLIER.GIGABYTE;
    }

    if (lowerCaseSizeStr.endsWith('t') || lowerCaseSizeStr.endsWith('tb')) {
      return Number.parseInt(lowerCaseSizeStr) * BYTES_MULTIPLIER.TERABYTE;
    }

    return Number.parseInt(lowerCaseSizeStr);
  }

  private async initLogFile(logPath: string): Promise<void> {
    const fullPath = path.join(logPath);
    const dirPath = path.dirname(logPath);

    try {
      this.logFile = await fs.open(fullPath, 'a');
      this.logFileSize = (await this.logFile.stat()).size;
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.mkdir(dirPath, { recursive: true });
        this.logFile = await fs.open(fullPath, 'a');
        this.logFileSize = (await this.logFile.stat()).size;
      } else {
        throw error;
      }
    }
  }

  private async initErrLogFile(logPath: string): Promise<void> {
    const fullPath = path.join(logPath);
    const dirPath = path.dirname(logPath);

    try {
      this.errLogFile = await fs.open(fullPath, 'a');
      this.errLogFileSize = (await this.errLogFile.stat()).size;
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.mkdir(dirPath, { recursive: true });
        this.errLogFile = await fs.open(fullPath, 'a');
        this.errLogFileSize = (await this.errLogFile.stat()).size;
      } else {
        throw error;
      }
    }
  }

  private async writeToLogFile(file: fs.FileHandle, data: string) {
    await this.writeToFile(file, data, this.logFileSizeLimit);
  }

  private async writeToErrLogFile(file: fs.FileHandle, data: string) {
    await this.writeToFile(file, data, this.errLogFileSizeLimit);
  }

  private async writeToFile(
    file: fs.FileHandle,
    data: string,
    fileSizeLimit: number,
  ): Promise<void> {
    await file.appendFile(data);
  }

  async log(message: any, context?: string) {
    const data = `${new Date().toISOString()} LOG [${
      context || ' - '
    }] ${message}\n`;

    await this.writeToLogFile(this.logFile, data);

    super.log(message, context);
  }

  async error(message: any, stack?: string, context?: string) {
    const data = `${new Date().toISOString()} LOG [${
      context || ' - '
    }] ${message}, Stack:\n${stack || 'stack was not provided'} \n`;

    await this.writeToErrLogFile(this.errLogFile, data);

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
