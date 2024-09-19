import {
  Controller,
  Post,
  Body,
  Res,
  UnprocessableEntityException,
  UseGuards,
  Req,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { AuthSignupDto } from "./dto/auth-signup.dto";
import { Response } from "express";
import { User } from "./entities/user.entity";
import { AuthGuard } from "@nestjs/passport";
import { IOAuthUser } from "./interface/auth.userInterface";
import * as bcrypt from "bcrypt";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async create(@Body() input: AuthSignupDto): Promise<User> {
    return this.authService.create(input);
  }

  @Post("login")
  async login(@Body() input: AuthLoginDto, @Res() res: Response) {
    const { email, password } = input;

    // 1. 이메일, 비밀번호 일치 유저 찾기
    const user = await this.authService.findOne(email);

    // 2. 일치하는 유저 없으면 에러
    if (!user) {
      throw new UnprocessableEntityException("이메일이 없습니다.");
    }

    // 3. 일치하는 유저가 있지만 비밀번호 틀린경우 에러
    const isAuth = await bcrypt.compare(password, user.password);

    if (!isAuth) {
      throw new UnprocessableEntityException("비밀번호가 일치하지 않습니다.");
    }

    // 4. 모두 일치 유저가 있다면 JWT Refresh Token 쿠키에 발급
    this.authService.setRefreshToken({ user, res });

    //5. 모두 일치 유저가 있다면 JWT Access Token 발급
    const jwt = this.authService.getAccessToken({ user });

    return res.status(200).send(jwt);
  }

  @UseGuards(AuthGuard("refresh"))
  @Post("refresh")
  restoreAccessToken(@Req() req: Request & IOAuthUser) {
    return this.authService.getAccessToken({ user: req.user });
  }
}
