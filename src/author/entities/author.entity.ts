import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Author {
  @Prop()
  name: string;

  @Prop()
  email?: string;

  @Prop()
  phone: string;

  @Prop()
  address?: string;

  @Prop()
  dob?: Date;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
AuthorSchema.virtual('books', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'author',
});
AuthorSchema.set('toObject', { virtuals: true });
AuthorSchema.set('toJSON', { virtuals: true });
