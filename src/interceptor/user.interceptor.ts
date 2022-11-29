/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prefer-const */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Request } from 'express';
const md5 = require('md5');

@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let ctx = context.switchToHttp();
    let request = ctx.getRequest<Request>();
    const password: string = request.body.password;
    const encryptPassword = md5(password);
    request.body.password = encryptPassword;
    return next.handle();
  }
}
