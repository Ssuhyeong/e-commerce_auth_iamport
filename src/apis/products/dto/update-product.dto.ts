import { PartialType } from "@nestjs/mapped-types";
import { CreateProductDto } from "./create-product.dto";
import {
  IsNumber,
  IsString,
  IsInt,
  IsOptional,
  IsObject,
} from "class-validator";
import { UpdateProductSalesLocationDto } from "./update-product-sales-location.dto";

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  price?: number;

  @IsObject()
  productSalesLocation: UpdateProductSalesLocationDto;

  @IsNumber()
  productCategoryId?: number;

  @IsString({ each: true })
  productTags?: string[];
}
