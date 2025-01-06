import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Tag {
  @Prop({ required: true })
  title!: string;

  @Prop({ default: null })
  description?: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
TagSchema.virtual('books', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'tags',
});
TagSchema.set('toObject', { virtuals: true });
TagSchema.set('toJSON', { virtuals: true });
