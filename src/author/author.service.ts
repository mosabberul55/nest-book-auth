import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Author } from './entities/author.entity';
@Injectable()
export class AuthorService {
  constructor(@InjectModel('Author') private authorModel: Model<Author>) {}
  create(createAuthorDto: CreateAuthorDto) {
    return this.authorModel.create(createAuthorDto);
  }

  findAll(): Promise<Author[]> {
    return this.authorModel.find();
  }

  findOne(id: string) {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    const author = this.authorModel.findById(id);
    if (!author) {
      throw new BadRequestException('Author not found.');
    }
    return author;
  }

  update(id: string, updateAuthorDto: UpdateAuthorDto) {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }
    return this.authorModel.findByIdAndUpdate(id, updateAuthorDto, {
      new: true,
    });
  }

  remove(id: string) {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }
    return this.authorModel.findByIdAndDelete(id);
  }
}
