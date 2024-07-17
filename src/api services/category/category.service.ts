import { Injectable } from '@nestjs/common';
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
  CategoryQueryDTO,
} from './category.dto';
import { PrismaService } from 'src/core services/prisma/prisma.service';
import { MinioService } from 'src/core services/minio/minio.service';
import { CloudinaryService } from 'src/core services/cloud-upload/cloud.service';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private minio: MinioService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(data: CreateCategoryDTO, file: Express.Multer.File) {
    const category = await this.prisma.category.create({ data });
    return { data: category };
  }

  async findAll(query: CategoryQueryDTO) {
    const { page, limit, skip } = query;
    const filter = query?.name ? { name: { contains: query.name } } : {};

    const [category, totalItems] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        where: filter,
        select: {
          id: true,
          name: true,
          description: true,
          _count: true,
        },
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.category.count({ where: filter }),
    ]);

    return {
      data: category,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    return { data: category };
  }

  async update(id: number, data: UpdateCategoryDTO) {
    const category = await this.prisma.category.update({ where: { id }, data });
    return { data: category };
  }

  async remove(id: number) {
    const category = await this.prisma.category.delete({ where: { id } });
    if (category.image) {
      const publicId = this.cloudinary.getPublicIdFromUrl(category.image);
      await this.deleteFile(publicId);
    }
    return { data: category };
  }

  async removeMany(ids: number[]) {
    const result = await this.prisma.category.deleteMany({
      where: { id: { in: ids } },
    });
    return { data: result };
  }

  async uploadImage(file: Express.Multer.File) {
    return this.cloudinary.uploadImage(file.buffer).then((data) => data.url);
  }

  async deleteFile(public_id: string) {
    return this.cloudinary.deleteFile(public_id);
  }
}
