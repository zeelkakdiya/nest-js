import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repo/user.repository';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const userClass = plainToInstance(User, value);
    const errors = await validate(userClass);

    return value;
  }
}
