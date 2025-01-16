import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  @Matches(/^(?=.*[0-9])/, {
    message: 'Password must contain at least one number',
  })
  readonly password: string;
}
