import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    { 
      logger: [
        'log', 
        'warn', 
        'error', 
      ] 
    }
  );

  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Authorization',
    ],
    exposedHeaders: ['Authorization'],
    credentials: true,
    origin: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const baseUrls = [
    {
      url: process.env.BASE_URL || `http://localhost:${process.env.PORT ?? 8080}`,
      description: 'Local server',
    },
    { 
      url: 'https://prod.example.com', 
      description: 'Production' 
    },
  ];

  await app.listen(process.env.PORT ?? 8080, async () => {
    const logger = new Logger();
    logger.log(`########## ${"VENDAS BACKEND"} ##########`);
    logger.log(`Servidor iniciado em ${baseUrls[0].url}`);
    logger.log(`########## ${"VENDAS BACKEND"} ##########`);
  });
}
bootstrap();
