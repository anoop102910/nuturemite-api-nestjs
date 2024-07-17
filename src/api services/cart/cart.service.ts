import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core services/prisma/prisma.service';
import { CartQueryDTO, CreateCartItemDTO, UpdateCartItemDTO } from './cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: number, createCartItemDto: CreateCartItemDTO) {
    const { productId, quantity } = createCartItemDto;
    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingCartItem) {
      return this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });
    } else {
      return this.prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
      });
    }
  }

  async getCartItems(userId: number, query: CartQueryDTO) {
    const { limit, page, skip } = query;

    const [cartItems, totalItems] = await this.prisma.$transaction([
      this.prisma.cartItem.findMany({
        where: {
          userId,
        },
        include: {
          product: true,
        },
        skip,
        take: limit,
      }),
      this.prisma.cartItem.count({
        where: {
          userId,
        },
      }),
    ]);

    return {
      data: cartItems,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };
  }

  async updateCartItem(cartItemId: number, data: UpdateCartItemDTO) {
    return this.prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data,
    });
  }

  async removeFromCart(userId: number, cartItemId: number) {
    await this.prisma.cartItem.delete({
      where: {
        id: cartItemId,
        userId,
      },
    });

    return { message: 'Cart item deleted successfully.' };
  }

  async clearCart(userId: number) {
    await this.prisma.cartItem.deleteMany({
      where: {
        userId,
      },
    });

    return { message: 'Cart cleared successfully.' };
  }
}
