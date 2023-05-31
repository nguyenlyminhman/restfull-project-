import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { SharedModule } from './shared/shared.module';
import { AppConfigService } from './shared/app-config.service';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerConfig } from './configs/swagger';
import helmet from 'helmet';
import morgan from 'morgan';
import { join } from 'path';
import * as fastifyStatic from '@fastify/static';


async function bootstrap(): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true
    })
  );

  const serverConfig = app.select(SharedModule).get(AppConfigService);
  const { port } = serverConfig.serverPort;

  app.register(fastifyStatic, {
    root: join(__dirname, 'public')
  })
  app.use(helmet());
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning();
  // Microservice config here

  // Setup swagger
  if (serverConfig.swaggerEnabled) {
    SwaggerConfig(app);
  }
  // Set global prefix for endpoint

  await app.listen(port);
  return app;
}

void bootstrap();
