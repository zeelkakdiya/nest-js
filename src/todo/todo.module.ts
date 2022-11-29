import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { UserModule } from 'src/user/user.module';
import { MiddlewareMiddleware } from 'src/middleware/middleware.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), UserModule],
  controllers: [TodoController],
  providers: [TodoService, JwtService],
})
export class TodoModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MiddlewareMiddleware).forRoutes('todo');
    // consumer.apply(MiddlewareMiddleware).forRoutes('/todo/findAllNotCompleted');
  }
}
