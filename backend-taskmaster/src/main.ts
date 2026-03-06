// backend-taskmaster/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(3000);

  console.log('\n🚀 Servidor corriendo en: http://localhost:3000');

  // Mostrar todas las rutas disponibles
  const server = app.getHttpServer();
  const router = server._events.request._router;

  console.log('\n📝 Rutas Usadas:');
  if (router && router.stack) {
    router.stack.forEach((layer: any) => {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
        const path = layer.route.path;
        console.log(`   ${methods} ${path}`);
      }
    });
  }
  console.log(''); // Línea en blanco al final
}
bootstrap();