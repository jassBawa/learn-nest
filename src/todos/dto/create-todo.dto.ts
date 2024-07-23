import { IsString, IsBoolean, IsOptional, Length } from 'class-validator';

export class CreateTodoDto {
  @IsString({ message: 'Title is required and must be a string' })
  @Length(1, 255, { message: 'Title must be between 1 and 255 characters' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @IsBoolean({ message: 'isDone must be a boolean value' })
  @IsOptional()
  isDone?: boolean;
}
