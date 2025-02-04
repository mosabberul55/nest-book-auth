import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAuthorDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  readonly email?: string;

  @IsNotEmpty()
  @IsString()
  readonly phone: string;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  readonly dob?: Date;
}
