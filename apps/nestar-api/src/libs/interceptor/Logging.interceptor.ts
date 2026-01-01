
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'; // ExecutionContext info about the current request (HTTP, GraphQL, etc.)
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { stringify } from 'querystring';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger: Logger = new Logger();


  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const recordTime = Date.now();
      const requestType = context.getType<GqlContextType>();

      if(requestType === 'http') {
        // Develop if needed
        return next.handle();
      } else if(requestType === 'graphql') {
        /* (1) Print Request */
        const gqlContext = GqlExecutionContext.create(context);
        this.logger.log(`${this.stringify(gqlContext.getContext().req.body)}`, 'REQUEST');

        /* (2) Error handling via GraphQL */
        /* (3) If there is no Error, then giving Response below */
        return next
        .handle()
        .pipe(
            tap((context) => { // this context is diffrent from "context: ExecutionContext". it is coming from resolver.
                const responseTime = Date.now() - recordTime
                this.logger.log(`${this.stringify(context)} - ${responseTime}ms \n\n`, 'RESPONSE')
            }),
        );
      }
      return next.handle();
  }
  private stringify(context: ExecutionContext): string {
    return JSON.stringify(context).slice(0, 75);
  }
}
