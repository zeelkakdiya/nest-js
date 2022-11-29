/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;

      const user = await this.userService.findUserByEmail(email);
      if (user != null) {
        return res
          .status(422)
          .json({ message: ` ${email}: This Email Address Already Existing` });
      }
      return next();
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: 'internal server error', error: error });
    }
  }
}
