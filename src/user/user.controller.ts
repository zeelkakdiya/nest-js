import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Constants } from 'src/utils/constants';
import { Request, Response } from 'express';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UserPipe } from 'src/pipe/pipe.pipe';
import { UserInterceptor } from 'src/interceptor/user.interceptor';
@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @UseInterceptors(new UserInterceptor())
  create(
    @Body(ValidationPipe)
    createUserDto: CreateUserDto,
  ) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiSecurity('JWT-auth')
  @UseGuards(new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  async findAll(@Req() req: Request, @Res() res: Response) {
    try {
      const users = await this.userService.findAll();

      if (!users.length) {
        return res.status(401).json({ message: 'User not Found' });
      }
      return res.status(200).json({ message: 'List of users', data: users });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: 'internal server error', error: error });
    }
  }

  @Get('/AuthenticateUser')
  async getUserById(@Req() req: Request, @Res() res: Response) {
    const id = req.user['userId'];
    try {
      const user = await this.userService.findUserById(id);

      if (!user) {
        return res.status(401).json({ message: 'User Not Found' });
      }
      if (!id) {
        return res.status(403).json({ message: 'Unauthorized User' });
      }
      return res.status(200).json({ message: 'User Details', data: user });
    } catch (error: any) {
      res.status(500).json({ message: 'internal server error', error: error });
    }
  }

  @Delete(':id')
  @ApiSecurity('JWT-auth')
  @UseGuards(new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
