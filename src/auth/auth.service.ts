import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
import { nanoid } from 'nanoid';
import { ResetToken } from './entities/reset-token.schema';
import { MailService } from '../services/mail.service';
import { RoleService } from '../role/role.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
    @InjectModel(ResetToken.name)
    private resetTokenModel: Model<ResetToken>,
    private jwtService: JwtService,
    private mailService: MailService,
    private rolesService: RoleService,
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

    const token = await this.generateToken(newUser._id);
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
    const token = await this.generateToken(user._id);
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
    return this.generateToken(user._id);
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found...');
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userModel.updateOne(
      { _id: userId },
      { password: hashedPassword },
    );
    return { message: 'Password changed successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const resetToken = nanoid(64);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    await this.resetTokenModel.create({
      token: resetToken,
      user: user._id,
      expiryDate: expiryDate,
    });
    await this.mailService.sendPasswordResetEmail(email, resetToken);

    return { message: 'Password reset link sent to your email' };
  }

  async resetPassword(newPassword: string, resetToken: string) {
    const token = await this.resetTokenModel.findOneAndDelete({
      token: resetToken,
      expiryDate: { $gte: new Date() },
    });
    if (!token) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userModel.updateOne(
      { _id: token.user },
      { password: hashedPassword },
    );
    return { message: 'Password reset successfully' };
  }

  async generateToken(userId: unknown) {
    const token = this.jwtService.sign({ userId }, { expiresIn: '10h' });
    const refreshToken = uuidv4();
    await this.storeRefreshToken(refreshToken, userId);
    return {
      accessToken: token,
      refreshToken: refreshToken,
    };
  }

  async storeRefreshToken(refreshToken: string, userId: unknown) {
    // Calculate expiry date 3 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    await this.refreshTokenModel.updateOne(
      {
        user: userId,
      },
      { $set: { token: refreshToken, expiryDate: expiryDate } },
      {
        upsert: true,
      },
    );
  }

  async getUserPermissions(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) throw new BadRequestException();

    const role = await this.rolesService.findOne(user.roleId.toString());
    return role.permissions;
  }
}
