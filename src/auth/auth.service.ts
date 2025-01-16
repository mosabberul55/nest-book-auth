import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/entities/user.entity';
import { Model } from 'mongoose';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async signUp(SignupDto: SignupDto) {
    //check if user already exists
    const user = await this.userModel.findOne({ email: SignupDto.email });
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(SignupDto.password, 10);
    const newUser = new this.userModel({
      ...SignupDto,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async login(LoginDto: LoginDto) {
    //check if user exists
    const user = await this.userModel.findOne({ email: LoginDto.email });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    //check if password is correct
    const isMatch = await bcrypt.compare(LoginDto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }
}
