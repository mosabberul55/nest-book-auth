import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';

export class UpdateBookDto extends PartialType(CreateBookDto) {}

// import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
// import { Category } from '../schemas/book.schema';
//
// export class UpdateBookDto {
//   @IsOptional()
//   @IsString()
//   readonly title: string;
//
//   @IsOptional()
//   @IsString()
//   readonly description: string;
//
//   @IsOptional()
//   @IsString()
//   readonly author: string;
//
//   @IsOptional()
//   @IsNumber()
//   readonly price: number;
//
//   @IsOptional()
//   @IsEnum(Category, { message: 'Please enter correct category.' })
//   readonly category: Category;
// }