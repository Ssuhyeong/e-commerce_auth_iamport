import { ConflictException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthSignupDto } from "./dto/auth-signup.dto";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  PASSWORD_SALT = 10;
  constructor(
    //주입받은 JWT Module의 서비스 이용
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly authRepository: Repository<User>
  ) {}

  async create(input: AuthSignupDto) {
    const { name, password, email, age } = input;

    const user = await this.authRepository.findOne({ email });

    if (user) {
      throw new ConflictException("이미 등록된 이메일입니다. ");
    }

    const hashedPassword = await bcrypt.hash(password, this.PASSWORD_SALT);

    const result = await this.authRepository.save({
      email,
      password: hashedPassword, // password 필드에 해시된 비밀번호 저장
      name,
      age,
    });

    return result;
  }

  async findOne(email: string): Promise<User> {
    return await this.authRepository.findOne({ email });
  }

  //Access Token 발급
  getAccessToken({ user }): String {
    return this.jwtService.sign(
      {
        email: user.email,
        sub: user.id,
      },
      {
        secret: "uGoPxyAk6kPfmWHx5X8yQlhzgUY1Rkz7",
        expiresIn: "5m",
      }
    );
  }

  // refreshToken 설정
  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      {
        email: user.email,
        sub: user.id,
      },
      {
        secret: "HwB4rUaqaDkGaFQUWhdUlhCdhJtEPfie",
        expiresIn: "2w",
      }
    );

    res.setHeader("Set-Cookie", `refreshToken=${refreshToken}`);
    return;
  }
}
