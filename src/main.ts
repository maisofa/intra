import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors-ts'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /*app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );*/

  /*app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true
  });*/

  app.use(
    cors({
      origin: 'http://localhost:3000',
      optionsSuccessStatus: 200,
      allowedHeaders: 'Content-Type, Accept',
      credentials: true
    })
  )

  await app.listen(3001);
}
bootstrap();
