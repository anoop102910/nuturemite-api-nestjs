import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core services/prisma/prisma.service';
import { CreateProductDTO, ProductQueryDTO } from './product.dto';
import { CloudinaryService } from 'src/core services/cloud-upload/cloud.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(data: CreateProductDTO) {
    const { vendorId, categoryId, brandId, ...rest } = data;
    const product = await this.prisma.product.create({
      data: {
        ...rest,
        vendor: {
          connect: {
            id: vendorId,
          },
        },
        category: {
          connect: {
            id: categoryId,
          },
        },
        brand: {
          connect: {
            id: brandId,
          },
        },
      },
    });
    return { data: product };
  }

  async findById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return { data: product };
  }

  async findAll(query?: ProductQueryDTO, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const filter: any = {};

    if (query.minPrice) {
      filter['price'] = {
        gte: query.minPrice,
      };
    }
    if (query.maxPrice) {
      filter['price'] = {
        lte: query.maxPrice,
      };
    }
    if (query.minDiscount) {
      filter['discount'] = {
        gte: query.minDiscount,
      };
    }
    if (query.minReview) {
      filter['reviews'] = {
        gte: query.minReview,
      };
    }
    if (query.isAvailable) {
      filter['stock'] = {
        gte: 1,
      };
    }
    if (query.name) {
      filter['name'] = {
        contains: query.name,
      };
    }
    if (query.brandId) {
      filter['brandId'] = query.brandId;
    }
    if (query.categoryId) {
      filter['categoryId'] = query.categoryId;
    }

    const [products, totalItems] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where: filter,
        skip,
        take: limit,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          brand: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.product.count({ where: filter }),
    ]);

    return {
      data: products,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };
  }

  async update(id: number, data: any) {
    const product = await this.prisma.product.update({
      where: { id },
      data,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return { data: product };
  }

  async remove(productId: number) {
    const product = await this.prisma.product.delete({
      where: {
        id: productId,
      },
    });
    return { data: product };
  }

  async uploadImage(file: Express.Multer.File) {
    return this.cloudinary.uploadImage(file.buffer).then((data) => data.url);
  }
}
