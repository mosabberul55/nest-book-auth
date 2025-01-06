import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { AuthorSchema } from './entities/author.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Author', schema: AuthorSchema }]),
  ],
  controllers: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}
