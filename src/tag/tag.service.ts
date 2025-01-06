import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(@InjectModel('Tag') private tagModel: Model<Tag>) {}
  create(createTagDto: CreateTagDto) {
    return this.tagModel.create(createTagDto);
  }

  findAll() {
    return this.tagModel.find().populate('books');
  }

  findOne(id: string) {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }
    return this.tagModel.findById(id);
  }

  update(id: string, updateTagDto: UpdateTagDto) {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }
    return this.tagModel.findByIdAndUpdate(id, updateTagDto, { new: true });
  }

  remove(id: string) {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }
    return this.tagModel.findByIdAndDelete(id);
  }
}
