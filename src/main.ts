import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import { logger2 } from './middleware/logger2.middleware';


// import * as dotenv from 'dotenv';
// import * as path from 'path';

// dotenv.config({
//   path: path.resolve(
//     (process.env.NODE_ENV == 'production') ? '.production.env'
//       : (process.env.NODE_ENV == 'stage') ? '.stage.env' : '.development.env'
//   )
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({transform: true}))
  app.use(logger2);
  await app.listen(3000);
}
bootstrap();
