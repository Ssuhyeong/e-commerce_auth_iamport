import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Put,
  ForbiddenException,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./entities/product.entity";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Put(":id")
  updateProduct(
    @Param("id") id: number,
    @Body() input: UpdateProductDto
  ): Promise<Product> {
    if (id !== input.id) {
      throw new ForbiddenException();
    }
    return this.productsService.modify(input);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.productsService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.productsService.delete(id);
  }
}
