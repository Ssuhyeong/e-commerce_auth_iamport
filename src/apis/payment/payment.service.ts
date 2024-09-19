import { Injectable } from "@nestjs/common";
import { Repository, Connection } from "typeorm";
import { Payment } from "./entities/payment.entity";
import { PAYMENT_TRANSACTION_STATUS_ENUM } from "./enum/paymentStatus.enum";
import { User } from "../auth/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly pointTransactionRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly connection: Connection
  ) {}

  async create({ impUid, amount, currentUser }) {
    const queryRunner = await this.connection.createQueryRunner();

    try {
      // T. 트랜잭션 사용을 위해서 queryRunner 연결
      await queryRunner.connect();
      // T. 트랜잭션 시작
      await queryRunner.startTransaction();

      // 1. pointTransaction 테이블에 거래기록 생성
      const pointTransaction = this.pointTransactionRepository.create({
        impUid: impUid,
        amount: amount,
        user: currentUser,
        status: PAYMENT_TRANSACTION_STATUS_ENUM.PAYMENT,
      });

      await queryRunner.manager.save(pointTransaction);

      // 2. 유저의 돈 찾아오기
      // T. 배타락을 걸어서 동시 Read 방지, 트랜잭션이 완료할 때 까지 다른 곳에서는 조회 불가.
      const user = await queryRunner.manager.findOne(
        User,
        { id: currentUser.id },
        { lock: { mode: "pessimistic_write" } } // serializable 수준인 경우 배타락 적용 가능
      );

      // 3. 유저의 돈 업데이트 ( 충전 )
      const updatedUser = await this.userRepository.create({
        ...user,
        point: user.point + amount,
      });

      await queryRunner.manager.save(updatedUser);

      // T. 트랜잭션 커밋
      await queryRunner.commitTransaction();

      // 4. 최종 결과 응답.
      return pointTransaction;
    } catch (err) {
      console.log(err);
      // T. 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
    } finally {
      // T. queryRunner 연결 종료
      await queryRunner.release();
    }
  }
}
