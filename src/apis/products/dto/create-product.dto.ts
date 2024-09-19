import { IsInt, IsNumber, IsObject, IsString, Min } from "class-validator";
import { CreateProductSalesLocationDto } from "./create-product-sales-location.dto";

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(0)
  price: number;

  @IsObject()
  productSalesLocation: CreateProductSalesLocationDto;

  @IsNumber()
  productCategoryId: number;

  @IsString({ each: true })
  productTags: string[];
}
