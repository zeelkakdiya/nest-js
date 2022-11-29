/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { validate } from 'class-validator';

import { Strategy } from 'passport-local';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
const md5 = require('md5');

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }
  async validate(email: string, password: string): Promise<User> {
    const user: User = await this.userService.findUserByEmail(email);

    if (!user) throw new UnauthorizedException('User Not Found : ' + email);
    if (user.password !== md5(password)) {
      throw new UnauthorizedException('Invalid Password :' + password);
    }
    if (user && user.password == md5(password)) return user;
  }
}
