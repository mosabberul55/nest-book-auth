import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from "mongoose";

export enum Category {
  ADVENTURE = 'Adventure',
  CALSSICS = 'Classics',
  CRIME = 'Crime',
  FANTASY = 'Fantasy',
}

@Schema({
  timestamps: true,
})
export class Book {
  @Prop()
  title: string;

  @Prop()
  description?: string;

  @Prop()
  author: mongoose.Schema.Types.ObjectId;

  @Prop()
  price: number;

  @Prop()
  category: Category;
}

export const BookSchema = SchemaFactory.createForClass(Book);
