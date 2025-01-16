import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body(new ValidationPipe()) SignupDto: SignupDto) {
    return this.authService.signUp(SignupDto);
  }

  @Post('login')
  login(@Body(new ValidationPipe()) LoginDto: LoginDto) {
    return this.authService.login(LoginDto);
  }
}
