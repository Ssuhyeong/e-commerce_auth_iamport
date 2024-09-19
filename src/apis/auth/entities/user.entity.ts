import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Payment } from "src/apis/payment/entities/payment.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column({ default: 0 })
  point: number;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}
