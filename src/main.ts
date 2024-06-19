import { NestFactory } from '@nestjs/core';
import { AppModule } from './bot/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://incredible-marzipan-6b9559.netlify.app/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept', 
  })
  await app.listen(3000);
}
bootstrap();
