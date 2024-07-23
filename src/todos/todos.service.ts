import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
  ) {}

  async findAll(page = 1, limit = 10, sort = 'id'): Promise<Todo[]> {
    const skip = (page - 1) * limit;
    return this.todosRepository.find({
      order: { [sort]: 'ASC' },
      skip,
      take: limit,
    });
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todosRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`Todo item with ID ${id} not found`);
    }
    return todo;
  }

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    try {
      const todo = this.todosRepository.create(createTodoDto);
      return await this.todosRepository.save(todo);
    } catch (error) {
      throw new Error(`Error creating todo: ${error.message}`);
    }
  }

  async update(id: number, updateTodoDto: CreateTodoDto): Promise<void> {
    const existingTodo = await this.findOne(id);
    if (!existingTodo) {
      throw new NotFoundException(`Todo item with ID ${id} not found`);
    }
    await this.todosRepository.update(id, updateTodoDto);
  }

  async partialUpdate(
    id: number,
    partialTodo: Partial<CreateTodoDto>,
  ): Promise<void> {
    const existingTodo = await this.findOne(id);
    if (!existingTodo) {
      throw new NotFoundException(`Todo item with ID ${id} not found`);
    }
    await this.todosRepository.save({ ...existingTodo, ...partialTodo });
  }

  async remove(id: number): Promise<void> {
    const existingTodo = await this.findOne(id);
    if (!existingTodo) {
      throw new NotFoundException(`Todo item with ID ${id} not found`);
    }
    await this.todosRepository.delete(id);
  }
}
