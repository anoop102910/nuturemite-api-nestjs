import { IsOptional, IsString } from 'class-validator';
import { PaginationDTO } from 'src/dto/pagination.dto';

export class CreateCategoryDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdateCategoryDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;
}

export class GetCategoryDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;
}

export class CategoryQueryDTO extends PaginationDTO {
  @IsOptional()
  @IsString()
  name?: string;
}
