// backend-taskmaster/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Habilitar validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:5173', // URL del frontend
    credentials: true,
  });

  // Usar el logger global
  app.useLogger(app.get(Logger));

  await app.listen(3000);

  // Mostrar todas las rutas disponibles
  const server = app.getHttpServer();
  const router = server._events.request._router;
  const availableRoutes: any[] = [];

  router.stack.forEach((layer: any) => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
      const path = layer.route.path;
      availableRoutes.push({ methods, path });
    }
  });

  logger.log('🚀 Servidor corriendo en: http://localhost:3000');
  logger.log('📝 Rutas disponibles:');
  availableRoutes.forEach(route => {
    logger.log(`   ${route.methods} ${route.path}`);
  });
}
bootstrap();