import { promises as fs } from 'fs';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';

import { apiVersion, appPort } from '@bn-config';
import { AppModule } from './app.module';
import * as nodeFetch from 'node-fetch';

import { ObjectIdValidationPipe } from '@bn-pipe/object-id-validation.pipe';

(global as any).fetch = nodeFetch;

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule, { cors: true });
  const appVersion = `/api/${apiVersion}`;

  app.useGlobalPipes(new ValidationPipe({ transform: true }), new ObjectIdValidationPipe());
  app.setGlobalPrefix(appVersion);
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 5 * 60 * 1000,
      max: 1000,
    }),
  );

  const overviewHtml = await fs.readFile('swagger/overview.html', 'utf8');
  const authenticationHtml = await fs.readFile('swagger/auth/overview.html', 'utf8');
  const privilegeHtml = await fs.readFile('swagger/privilege/overview.html', 'utf8');
  const userHtml = await fs.readFile('swagger/user/overview.html', 'utf8');
  const folderHtml = await fs.readFile('swagger/folder/overview.html', 'utf8');
  const fileHtml = await fs.readFile('swagger/file/overview.html', 'utf8');

  const options = new DocumentBuilder()
    .setTitle('zTeros / NestJS / PostgresSQL / Amazon Cognito Demonstrator')
    .setDescription(overviewHtml)
    .setVersion('1.0')
    .addTag('Authentication', authenticationHtml)
    .addTag('Privileges', privilegeHtml)
    .addTag('Users', userHtml)
    .addTag('Folder Management', folderHtml)
    .addTag('File Management', fileHtml)
    .setBasePath(appVersion)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const port = appPort || 3000;
  await app.listen(port);
  logger.log(`Start application on port ${port}`);
}

bootstrap();
