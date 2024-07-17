import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core services/prisma/prisma.service';
import { CreateWishlistItemDTO, WishlistQueryDTO } from './wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async addToWishlist(
    userId: number,
    createWishlistItemDto: CreateWishlistItemDTO,
  ) {
    const { productId } = createWishlistItemDto;
    const existingWishlistItem = await this.prisma.wishlistItem.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingWishlistItem) {
      throw new ConflictException('Wishlist item already exists');
    }

    return this.prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
    });
  }

  async getWishlistItems(userId: number, query: WishlistQueryDTO) {
    const { limit, page, skip } = query;

    const [wishlistItems, totalItems] = await this.prisma.$transaction([
      this.prisma.wishlistItem.findMany({
        where: {
          userId,
        },
        include: {
          product: true,
        },
        skip,
        take: limit,
      }),
      this.prisma.wishlistItem.count({
        where: {
          userId,
        },
      }),
    ]);

    return {
      data: wishlistItems,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };
  }

  async removeFromWishlist(userId: number, wishlistItemId: number) {
    const wishlistItem = await this.prisma.wishlistItem.findUnique({
      where: {
        id: wishlistItemId,
        userId,
      },
    });

    if (!wishlistItem) {
      throw new NotFoundException(
        'Wishlist item not found or does not belong to the user.',
      );
    }

    await this.prisma.wishlistItem.delete({
      where: {
        id: wishlistItemId,
      },
    });

    return { message: 'Wishlist item deleted successfully.' };
  }

  async clearWishlist(userId: number) {
    await this.prisma.wishlistItem.deleteMany({
      where: {
        userId,
      },
    });

    return { message: 'Wishlist cleared successfully.' };
  }
}
