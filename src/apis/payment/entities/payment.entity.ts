import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PAYMENT_TRANSACTION_STATUS_ENUM } from "../enum/paymentStatus.enum";
import { User } from "src/apis/auth/entities/user.entity";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn("increment")
  id: string;

  @Column()
  impUid: string;

  @Column()
  amount: number;

  @Column({ type: "enum", enum: PAYMENT_TRANSACTION_STATUS_ENUM })
  status: string;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
