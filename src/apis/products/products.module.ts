import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { ProductSalesLocation } from "./entities/productSalesLocation.entity";
import { ProductTag } from "./entities/productTags.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductSalesLocation, ProductTag]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
