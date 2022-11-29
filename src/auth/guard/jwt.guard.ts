import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Constants } from 'src/utils/constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    for (let index = 0; index < Constants.BY_PASS_URL.length; index++) {
      if (request.url == Constants.BY_PASS_URL[index]) return true;
    }

    return super.canActivate(context);
  }
}
