import { IsInt, IsString } from "class-validator";

export class PaymentInput {
  @IsString()
  impUid: string;

  @IsInt()
  amount: number;
}
