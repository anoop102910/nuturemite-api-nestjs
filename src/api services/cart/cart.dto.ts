import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { PaginationDTO } from 'src/dto/pagination.dto';

export class CreateCartItemDTO {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  productId: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(0)
  quantity: number = 1;
}

export class UpdateCartItemDTO {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(0)
  quantity?: number = 1;
}

export class CartQueryDTO  extends PaginationDTO {
  @IsOptional()
  @IsInt()
  productId?: number;
}

