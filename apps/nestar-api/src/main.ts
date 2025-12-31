import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();

/**
 * 
 import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
 import { GqlContextType } from '@nestjs/graphql';
 import { Observable } from 'rxjs';
 import { tap } from 'rxjs/operators';
 
 @Injectable()
 export class LoggingInterceptor implements NestInterceptor {
     private readonly logger: Logger = new Logger();
 
 
   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
       const recordTime = Date.now();
       const requestType = context.getType<GqlContextType>();
 
       if(requestType === 'http') {
         // Develop id needed!
       } else if(requestType === 'graphql') {
         this.logger.log(`Type: ${requestType}`, 'REQUEST');
         return next
         .handle()
         .pipe(
             tap(() => {
                 const responseTime = Date.now() - recordTime
                 this.logger.log(`${responseTime}ms`, 'RESPONSE')
             }),
         );
       }
   }
 }
 
 */
