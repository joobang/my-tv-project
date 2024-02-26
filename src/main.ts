import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import { logger2 } from './middleware/logger2.middleware';
import { AuthGuard } from './auth/guard/auth.guard';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';


// import * as dotenv from 'dotenv';
// import * as path from 'path';

// dotenv.config({
//   path: path.resolve(
//     (process.env.NODE_ENV == 'production') ? '.production.env'
//       : (process.env.NODE_ENV == 'stage') ? '.stage.env' : '.development.env'
//   )
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger: WinstonModule.createLogger({
      transports: [
       new winston.transports.Console({
        level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike('MyApp', { prettyPrint: true}),
        )
       }),
      ],
    }),
  });
  app.useGlobalPipes(new ValidationPipe({transform: true}));
  //sapp.useGlobalFilters(new HttpExceptionFilter());
  //app.useGlobalGuards(new AuthGuard());
  //app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  await app.listen(3000);
}
bootstrap();
