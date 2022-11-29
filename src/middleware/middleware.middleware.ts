/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MiddlewareMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async use(req: any, res: Response, next: NextFunction) {
    try {
      const token: any =
        req.headers['authorization'] || req.headers['x-access-token'];

      const userToken = req.headers['authorization']?.substr(7);

      if (!token) {
        return res.status(403).json({ message: 'Token Missing' });
      }

      if (!token.toLowerCase().startsWith('bearer')) {
        return res.status(403).json({ message: 'invalid Token' });
      }

      const bearerToken: string = token.split(' ')[1];

      if (!bearerToken) {
        return res.status(403).json({ message: 'invalid Token' });
      }

      const decodedToken = await this.jwtService.verify(bearerToken, {
        secret: this.configService.get('JWT_KEY'),
      });
      req.token = decodedToken;

      return next();
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: 'internal server error', error: error });
    }
  }
}
