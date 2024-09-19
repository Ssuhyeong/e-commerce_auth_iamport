import { Product } from "src/apis/products/entities/product.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductTag {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Product, (products) => products.productTags)
  products: Product[];
}
