import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggingService } from './logging/logging.service';
import { CustomExceptionFilter } from './filters/custom-exception.filter';

const LOG_LEVELS = new Set(['log', 'error', 'warn', 'debug', 'verbose']);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(LoggingService);
  app.useLogger(logger);

  try {
    const logLevels = JSON.parse(process.env.LOG_LEVEL);
    if (
      Array.isArray(logLevels) &&
      logLevels.every((level) => LOG_LEVELS.has(level))
    ) {
      logger.setLogLevels(logLevels);
    } else {
      logger.setLogLevels(['log']);
    }
  } catch (error) {
    logger.setLogLevels(['log']);
  }

  process.on('uncaughtException', (error) => {
    const { name, message, stack } = error;
    logger.error(`${name}: ${message}`, stack, 'NodeJS UncaughtException');
  });

  process.on('unhandledRejection', (reason) => {
    logger.error(reason, '', 'NodeJS UnhandledRejection');
  });

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new CustomExceptionFilter(httpAdapter, logger));

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
