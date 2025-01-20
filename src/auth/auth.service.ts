import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/entities/user.entity';
import { Model } from 'mongoose';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './entities/refresh-token.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
    private jwtService: JwtService,
  ) {}

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
    await newUser.save();

    const token = await this.generateToken(newUser);
    return { token: token, user: newUser };
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
    const token = await this.generateToken(user);
    return { token: token, user: user };
  }

  async getProfile(userId: string) {
    return this.userModel.findById(userId);
  }

  async refreshToken(refreshToken: string) {
    const token = await this.refreshTokenModel.findOne({
      token: refreshToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Refresh Token is invalid');
    }
    const user = await this.userModel.findById(token.user);
    return this.generateToken(user);
  }

  async generateToken(user: User) {
    const token = this.jwtService.sign({ user }, { expiresIn: '30d' });
    const refreshToken = uuidv4();
    await this.storeRefreshToken(refreshToken, user._id);
    return {
      accessToken: token,
      refreshToken: refreshToken,
    };
  }

  async storeRefreshToken(refreshToken: string, userId: unknown) {
    return await this.refreshTokenModel.create({
      token: refreshToken,
      user: userId,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  }
}
