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
import { ProductService } from './product.service';
import {
  CreateProductDTO,
  UpdateProductDTO,
  ProductQueryDTO,
} from './product.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/decorators/get-user.decorator';

@Controller('api/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'vendor')
  @Post('/')
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(
    @GetUser('id') vendorId: number,
    @Body() data: CreateProductDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      data.image = await this.productService.uploadImage(file);
    }
    data.vendorId = vendorId;
    return this.productService.create(data);
  }

  @Get('')
  async getProducts(@Query() query?: ProductQueryDTO) {
    return this.productService.findAll(query);
  }

  @Get('/:id')
  async getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findById(id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'vendor')
  @Put('/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProductDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      data.image = await this.productService.uploadImage(file);
    }
    return this.productService.update(id, data);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin')
  @Delete('/:id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
