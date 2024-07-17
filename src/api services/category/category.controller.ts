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
import { CategoryService } from './category.service';
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
  CategoryQueryDTO,
} from './category.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'vendor')
  @Post('/')
  @UseInterceptors(FileInterceptor('image'))
  async createCategory(
    @Body() data: CreateCategoryDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const imageurl = await this.categoryService.uploadImage(file);
      data.image = imageurl;
    }
    return this.categoryService.create(data, file);
  }

  @Get('')
  async getCategorys(@Query() query?: CategoryQueryDTO) {
    return this.categoryService.findAll(query);
  }

  @Get('/:id')
  async getCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'vendor')
  @Put('/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCategoryDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const imageurl = await this.categoryService.uploadImage(file);
      data.image = imageurl;
    }
    return this.categoryService.update(id, data);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'vendor')
  @Delete('/:id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'vendor')
  @Delete('/delete')
  async deleteCategorys(@Body() ids: number[]) {
    return this.categoryService.removeMany(ids);
  }
}
