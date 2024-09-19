import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { AuthGuard } from "@nestjs/passport";
import { PaymentInput } from "./dto/paymentInput.dtd";
import { IOAuthUser } from "../auth/interface/auth.userInterface";

@Controller("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard("access"))
  @Post()
  createPointTransaction(
    @Body() input: PaymentInput,
    @Req() req: Request & IOAuthUser
  ) {
    const currentUser = req.user;
    const { impUid, amount } = input;
    return this.paymentService.create({ impUid, amount, currentUser });
  }
}
