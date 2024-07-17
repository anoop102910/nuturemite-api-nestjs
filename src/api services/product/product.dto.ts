import {
  IsInt,
  IsDecimal,
  IsUrl,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  IsPositive,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  isSale?: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: (args) => `Price must be a valid decimal number. Received: ${args.value}` })
  @IsPositive()
  price: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  discount: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  quantity?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  vendorId?: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  categoryId: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  brandId: number;

  @IsOptional()
  @IsString()
  keywords?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  sku?: number;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsUrl()
  image?: string;
}

export class UpdateProductDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  isSale?: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: (args) => `Price must be a valid decimal number. Received: ${args.value}` })
  @IsPositive()
  price: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  discount?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  quantity?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  brandId?: number;

  @IsOptional()
  @IsString()
  keywords?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  sku?: number;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsUrl()
  image?: string;
}

export class ProductQueryDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  maxPrice?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  brandId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Transform(({ value }) => parseFloat(value))
  minDiscount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Transform(({ value }) => parseFloat(value))
  maxDiscount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10))
  minInventory?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10))
  maxInventory?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Transform(({ value }) => parseFloat(value))
  minReview?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isAvailable?: boolean;
}
