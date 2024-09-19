import {
  IsInt,
  IsNumber,
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
} from "class-validator";

export class AuthSignupDto {
  @IsNotEmpty()
  @IsEmail({}, { message: "유효한 이메일 주소를 입력해 주세요." })
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 15)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, {
    message:
      "비밀번호는 적어도 하나의 대문자, 소문자, 숫자, 특수 문자를 포함해야 합니다.",
  })
  password: string;

  @IsString()
  name: string;

  @IsInt()
  age: number;
}
