import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @ApiProperty()
  title: string;
}
