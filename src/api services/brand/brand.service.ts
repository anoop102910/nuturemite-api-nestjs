import { Injectable } from '@nestjs/common';
import { CreateBrandDTO, UpdateBrandDTO, BrandQueryDTO } from './brand.dto';
import { PrismaService } from 'src/core services/prisma/prisma.service';
import { MinioService } from 'src/core services/minio/minio.service';
import { CloudinaryService } from 'src/core services/cloud-upload/cloud.service';

@Injectable()
export class BrandService {
  constructor(
    private prisma: PrismaService,
    private minio: MinioService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(data: CreateBrandDTO, file: Express.Multer.File) {
    const brand = await this.prisma.brand.create({ data });
    return { data: brand };
  }

  async findAll(query: BrandQueryDTO) {
    const { page, limit, skip } = query;
    const filter = query?.name ? { name: { contains: query.name } } : {};

    const [brands, totalItems] = await this.prisma.$transaction([
      this.prisma.brand.findMany({
        where: filter,
        skip,
        take: limit,
      }),
      this.prisma.brand.count({ where: filter }),
    ]);

    return {
      data: brands,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };
  }

  async findOne(id: number) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    return { data: brand };
  }

  async update(id: number, data: UpdateBrandDTO) {
    const brand = await this.prisma.brand.update({ where: { id }, data });
    return { data: brand };
  }

  async remove(id: number) {
    const brand = await this.prisma.brand.delete({ where: { id } });
    if (brand.image) {
      const publicId = this.cloudinary.getPublicIdFromUrl(brand.image);
      await this.deleteFile(publicId);
    }
    return { data: brand };
  }

  async removeMany(ids: number[]) {
    const result = await this.prisma.brand.deleteMany({
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
