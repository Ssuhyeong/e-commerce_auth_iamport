import { type } from "os";
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
} from "typeorm";
import { ProductSalesLocation } from "./productSalesLocation.entity";
import { ProductCategory } from "./productCategory.entity";
import { ProductTag } from "./productTags.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ default: "No description provided" })
  description: string;

  @Column({ default: 0 })
  price: number;

  @Column({ default: false })
  isSoldOut: boolean;

  @DeleteDateColumn() //TypeORM 제공 삭제여부 타임스탬프
  deletedAt: Date;

  @UpdateDateColumn() //TypeORM 제공 삭제여부 타임스탬프
  updatedAt: Date;

  // 1:1 엔터티 연결
  @JoinColumn()
  @OneToOne(() => ProductSalesLocation)
  productSalesLocation: ProductSalesLocation;

  // N(상품): 1(카테고리) 엔터티 연결
  // Many의 테이블에서는 JoinColumn 생략해도 one의 테이블 Join 가능
  @ManyToOne(
    (type) => ProductCategory,
    (productCategory) => productCategory.products
  )
  productCategory: ProductCategory;

  // // N(상품): 1(유저) 엔터티 연결
  // @ManyToOne((type) => User, (user) => user.products)
  // user: User;

  //N(상품): M(상품태그) 엔터티 연결, ProductTags가 나를 찾을 때 인식하는 방법을 무명 함수로 인자 넣음
  //JoinTable은 N:M 관계의 중간 테이블을 자동 생성해주며, 기준 테이블 한쪽에만 작성하면 됨
  @JoinTable()
  @ManyToMany(() => ProductTag, (productTags) => productTags.products)
  productTags: ProductTag[];
}
