import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { JwtAccessStrategy } from "./strategies/jwt-access.strategy";
import { JwtRefreshStretagy } from "./strategies/jwt-refresh.strategy";

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStretagy],
})
export class AuthModule {}
