import { NestFactory } from '@nestjs/core';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Movie Review')
    .setDescription('The Movie Review API description')
    .setVersion('0.1')
    .addTag('movie-reviews')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_: string, methodKey: string) => methodKey,
  };
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
