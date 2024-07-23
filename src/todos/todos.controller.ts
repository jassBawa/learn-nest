import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './todo.entity';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
  ): Promise<Todo[]> {
    return this.todosService.findAll(page, limit, sort);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Todo> {
    return this.todosService.findOne(+id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createTodoDto: CreateTodoDto) {
    try {
      console.log('inside create');
      return await this.todosService.create(createTodoDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async partialUpdate(
    @Param('id') id: string,
    @Body() partialTodo: Partial<CreateTodoDto>,
  ): Promise<void> {
    await this.todosService.partialUpdate(+id, partialTodo);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.todosService.remove(+id);
  }
}
