import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { PaginationDTO } from 'src/dto/pagination.dto';

export class CreateWishlistItemDTO {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  productId: number;
}

export class WishlistQueryDTO extends PaginationDTO {
  @IsOptional()
  @IsInt()
  productId?: number;
}
