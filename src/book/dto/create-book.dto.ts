import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";
import { Category } from '../entities/book.entity';
import mongoose from 'mongoose';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsNotEmpty()
  @IsString()
  readonly author: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsArray()
  readonly tags?: mongoose.Schema.Types.ObjectId[];

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsEnum(Category, { message: 'Please enter correct category.' })
  readonly category: Category;
}
