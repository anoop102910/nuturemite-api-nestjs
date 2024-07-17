import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { PaginationDTO } from 'src/dto/pagination.dto';

export class CreateBrandDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string; 

  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdateBrandDTO {
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

export class GetBrandDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;
}

export class BrandQueryDTO extends PaginationDTO {
  @IsOptional()
  @IsString()
  name?: string;
}
