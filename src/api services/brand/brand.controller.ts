import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDTO, UpdateBrandDTO, BrandQueryDTO } from './brand.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin','vendor')
  @Post('/')
  @UseInterceptors(FileInterceptor('image'))
  async createBrand(
    @Body() data: CreateBrandDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const imageurl = await this.brandService.uploadImage(file);
      data.image = imageurl;
    }
    return this.brandService.create(data, file);
  }

  @Get('')
  async getBrands(@Query() query?: BrandQueryDTO) {
    return this.brandService.findAll(query);
  }

  @Get('/:id')
  async getBrand(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.findOne(id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin','vendor')
  @Put('/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateBrand(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateBrandDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const imageurl = await this.brandService.uploadImage(file);
      data.image = imageurl;
    }
    return this.brandService.update(id, data);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin','vendor')
  @Delete('/:id')
  async deleteBrand(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.remove(id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin','vendor')
  @Delete('/delete')
  async deleteBrands(@Body() ids: number[]) {
    return this.brandService.removeMany(ids);
  }
}
