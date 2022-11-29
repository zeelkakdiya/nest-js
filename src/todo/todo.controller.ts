/* eslint-disable prefer-const */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { MiddlewareBuilder } from '@nestjs/core';

@Controller('todo')
@ApiTags('Todo')
@ApiSecurity('JWT-auth')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(
    @Body(ValidationPipe) createTodoDto: CreateTodoDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const id = req.user['userId'];
      const todo = await this.todoService.create(createTodoDto, Number(id));

      if (!todo) {
        return res.status(404).json({ message: 'UnauthoRized User ' });
      }
      return res
        .status(201)
        .json({ message: 'Your Task Successfully Added', data: todo });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'internal server error', error: error });
    }
  }

  @Get('/findAllNotCompleted')
  async findAllTodosByUserIdNotCompleted(@Req() req, @Res() res) {
    try {
      const id = req.user['userId'];
      const todo = await this.todoService.findAllTodoUserNotCompleted(id);

      if (!todo.length) {
        return res.status(404).json({ message: 'Todos Not Found' });
      }
      return res
        .status(201)
        .json({ message: 'List Of Not Completed Todo', data: todo });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'internal server error', error: error });
    }
  }

  @Get('/findAllCompleted')
  async findAllTodosByUserIdCompleted(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const id = req.user['userId'];

      const todo = await this.todoService.findAllTodoUserCompleted(id);

      if (!todo.length) {
        return res.status(404).json({ message: 'Todos Not Found ' });
      }
      return res
        .status(201)
        .json({ message: 'List Of Completed Todo', data: todo });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'internal server error', error: error });
    }
  }

  @Patch()
  async update(
    @Req() req: Request,
    @Res() res: Response,
    @Query('todoId') todoId: number,
  ) {
    try {
      const id = req.user['userId'];

      const todo = await this.todoService.findTodo(todoId);

      if (!todo) {
        return res.json({ message: 'Invalid Todo Id' });
      }

      if (todo.user.id != id) {
        return res.status(404).json({ message: 'Invalid Todo Id' });
      }

      const todoUpdate = await this.todoService.update(todoId);

      if (!todoUpdate) {
        return res.status(405).json({ message: 'Todo Not Updated Try Again' });
      }
      return res
        .status(202)
        .json({ message: 'Todo Updated SuccessFully', data: todoUpdate });
    } catch (error) {
      return res
        .status(501)
        .json({ message: 'internal server error', error: error });
    }
  }

  @Delete()
  async remove(
    @Req() req: Request,
    @Res() res: Response,
    @Query('todoId') todoId: number,
  ) {
    try {
      const id = req.user['userId'];

      const todo = await this.todoService.findTodo(todoId);

      if (!todo) {
        return res.json({ message: 'Invalid Todo Id' });
      }

      if (todo.user.id != id) {
        return res.status(404).json({ message: 'Invalid Todo Id' });
      }

      const todoDeleted = await this.todoService.remove(todoId);
      if (!todoDeleted) {
        return res.status(405).json({ message: 'Todo Not Deleted Try Again' });
      }
      return res
        .status(202)
        .json({ message: 'Todo Deleted SuccessFully', data: todoDeleted });
    } catch (error) {
      return res
        .status(501)
        .json({ message: 'internal server error', error: error });
    }
  }
}
