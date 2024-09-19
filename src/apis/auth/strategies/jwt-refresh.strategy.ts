import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtRefreshStretagy extends PassportStrategy(Strategy, "refresh") {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        const cookie = req.cookies["refreshToken"];
        return cookie;
      },
      secretOrKey: "HwB4rUaqaDkGaFQUWhdUlhCdhJtEPfie",
    });
  }

  // 검증 성공 시 실행, 실패 시는 에러
  // Passport는 validate에 성공할 시 리턴값을 reqeust.user에 저장

  validate(payload) {
    return {
      email: payload.email,
      id: payload.sub,
    };
  }
}
