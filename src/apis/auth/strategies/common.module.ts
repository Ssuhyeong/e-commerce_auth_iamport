import { Module } from "@nestjs/common";
import { JwtAccessStrategy } from "./jwt-access.strategy";
import { JwtRefreshStretagy } from "./jwt-refresh.strategy";

@Module({
  imports: [],
  providers: [JwtAccessStrategy, JwtRefreshStretagy],
  exports: [JwtRefreshStretagy, JwtAccessStrategy],
})
export class CommonModule {}
