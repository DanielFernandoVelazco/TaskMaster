// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades que no están en los DTOs
    forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
    transform: true, // Transforma los objetos a instancias de DTO
  }));

  // Habilitar CORS para que el frontend pueda hacer peticiones
  app.enableCors();

  await app.listen(3000);
  console.log(`🚀 Servidor corriendo en: http://localhost:3000`);
}
bootstrap();