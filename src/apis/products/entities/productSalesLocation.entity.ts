import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductSalesLocation {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  address: string;

  @Column()
  addressDetail: string;

  @Column({ type: "decimal" })
  lat: number; //위도

  @Column({ type: "decimal" })
  lng: number; //경도

  @Column()
  meetingTime: Date;
}
