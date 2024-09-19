import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { ProductSalesLocation } from "./entities/productSalesLocation.entity";
import { ProductTag } from "./entities/productTags.entity";
import { Connection } from "typeorm";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductSalesLocation)
    private readonly productSalesLocationRepository: Repository<ProductSalesLocation>,
    @InjectRepository(ProductTag)
    private readonly productTagRepository: Repository<ProductTag>,
    private readonly connection: Connection
  ) {}

  async create(input: CreateProductDto): Promise<Product> {
    const { productSalesLocation, productCategoryId, productTags, ...product } =
      input;
    const queryRunner = await this.connection.createQueryRunner();

    try {
      // T. 트랜잭션 사용을 위해서 queryRunner 연결
      await queryRunner.connect();
      // T. 트랜잭션 시작
      await queryRunner.startTransaction();

      //위치 저장
      const location = await this.productSalesLocationRepository.create({
        ...productSalesLocation,
      });

      await queryRunner.manager.save(location);

      //태그 등록
      const productTagList = await Promise.all(
        productTags.map((el) => {
          return new Promise(async (resolve, reject) => {
            const tagName = el.replace("#", "");

            const existTag = await queryRunner.manager
              .createQueryBuilder(ProductTag, "pt")
              .where("pt.name = :name", { name: tagName })
              .getOne();

            if (existTag) {
              resolve(existTag);
            } else {
              const newTag = await this.productTagRepository.create({
                name: tagName,
              });
              await queryRunner.manager.save(newTag);
              resolve(newTag);
            }
          });
        })
      );

      const products = await this.productRepository.create({
        ...product,
        productSalesLocation: location,
        productCategory: {
          id: String(productCategoryId),
        },
        productTags: productTagList,
      });

      const result = await queryRunner.manager.save(products);

      // T. 트랜잭션 커밋
      await queryRunner.commitTransaction();

      return result;
    } catch (e) {
      // T. 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
    } finally {
      // T. queryRunner 연결 종료
      await queryRunner.release();
    }
  }

  async modify(input: UpdateProductDto): Promise<Product> {
    const { productSalesLocation, productCategoryId, productTags, ...product } =
      input;

    const exist = await this.productRepository.findOne({
      where: { id: product.id },
      relations: ["productSalesLocation"],
    });

    // 위치 갱신
    const location = await this.productSalesLocationRepository.save({
      ...productSalesLocation,
      id: exist.productSalesLocation.id,
    });

    // 태그 등록
    const productTagList = await Promise.all(
      productTags.map((el) => {
        return new Promise(async (resolve, reject) => {
          const tagName = el.replace("#", "");
          const existTag = await this.productTagRepository.findOne({
            name: tagName,
          });

          if (existTag) {
            resolve(existTag);
          } else {
            const newTag = await this.productRepository.save({
              name: tagName,
            });
            resolve(newTag);
          }
        });
      })
    );

    const newProduct = await this.productRepository.save({
      ...exist,
      ...Product,
      productSalesLocation: location,
      ProductCategory: {
        id: String(productCategoryId),
      },
      productTags: productTagList,
    });
    const result = await this.productRepository.save(newProduct);

    return result;
  }

  async findAll(): Promise<Product[]> {
    const result = await this.productRepository.find({
      join: {
        alias: "p",
        leftJoinAndSelect: {
          id: "p.productCategory",
        },
      },
    });

    return result;
  }

  async findOne(id: number) {
    const result = await this.productRepository
      .createQueryBuilder("p")
      .select(["p.id", "p.name", "pc.name", "pt.name"])
      .leftJoin("p.productCategory", "pc")
      .leftJoin("p.productTags", "pt")
      .where("p.id = :id", { id: id })
      .getOne();

    return result;
  }

  async delete(id: number): Promise<Product> {
    const result = await this.productRepository.softRemove({ id: String(id) });
    return result;
  }
}
