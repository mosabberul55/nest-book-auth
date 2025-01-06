import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Query } from 'express-serve-static-core';

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}
  create(createBookDto: CreateBookDto): Promise<Book> {
    return this.bookModel.create(createBookDto);
  }

  async findAll(query: Query): Promise<{ data: Book[]; meta: any }> {
    const resPerPage = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * resPerPage;
    const search = query.search
      ? { title: { $regex: query.search, $options: 'i' } }
      : {};

    const total = await this.bookModel.countDocuments({ ...search });
    const books = await this.bookModel
      .find({ ...search })
      .skip(skip)
      .limit(resPerPage)
      .populate(['author', 'tags']);

    const lastPage = Math.ceil(total / resPerPage);
    const from = skip + 1;
    const to = skip + books.length;
    const meta = {
      total,
      from,
      to,
      current_page: page,
      last_page: lastPage,
    };
    return { data: books, meta };
  }

  async findOne(id: string) {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new NotFoundException('Book not found.');
    }

    return book;
  }

  update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }
    const book = this.bookModel.findByIdAndUpdate(id, updateBookDto, {
      new: true,
    });
    if (!book) {
      throw new Error('Item not found');
    }
    return book;
  }

  remove(id: string) {
    const book = this.bookModel.findByIdAndDelete(id);
    if (!book) {
      throw new Error('Item not found');
    }
    return 'Item deleted';
  }
}
