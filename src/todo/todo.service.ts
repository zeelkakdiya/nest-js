/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Module } from 'module';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRespository: Repository<Todo>,
    private readonly userService: UserService,
  ) {}

  async create(createTodoDto: CreateTodoDto, userId: number) {
    let todo: Todo = new Todo();
    todo.title = createTodoDto.title;
    todo.date = new Date().toLocaleString();
    todo.completed = false;
    todo.user = await this.userService.findUserById(userId);

    return this.todoRespository.save(todo);
  }

  findAllTodoUserNotCompleted(userId: number) {
    return this.todoRespository.find({
      relations: ['user'],
      where: { user: { id: userId }, completed: false },
    });
  }

  findAllTodoUserCompleted(userId: number) {
    return this.todoRespository.find({
      relations: ['user'],
      where: { user: { id: userId }, completed: true },
    });
  }

  findTodo(id: number) {
    return this.todoRespository.findOne({
      where: { id: id },
      relations: ['user'],
    });
  }

  update(todoId: number) {
    return this.todoRespository.update(todoId, { completed: true });
  }

  remove(todoId: number) {
    return this.todoRespository.delete(todoId);
  }
}
