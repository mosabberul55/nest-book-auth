import { Controller, Get, Post, Body, Param, Delete, ValidationPipe, Put, Query } from "@nestjs/common";
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { Query as ExpressQuery } from 'express-serve-static-core';

export type Meta = {
  total: number;
  from: number;
  to: number;
  current_page: number;
  last_page: number;
};

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(
    @Body(new ValidationPipe()) createBookDto: CreateBookDto,
  ): Promise<Book> {
    return this.bookService.create(createBookDto);
  }

  @Get()
  findAll(@Query() query: ExpressQuery): Promise<{ data: Book[]; meta: Meta }> {
    return this.bookService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Book> {
    return this.bookService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }
}
