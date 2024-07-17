import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  Get,
  UseGuards,
  Query,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistQueryDTO, CreateWishlistItemDTO } from './wishlist.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';

@Controller('api/wishlistitems')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  async addToWishlist(
    @GetUser('id') userId: number,
    @Body() data: CreateWishlistItemDTO,
  ) {
    return this.wishlistService.addToWishlist(userId, data);
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async getWishlistItems(
    @GetUser('id') userId: number,
    @Query() query: WishlistQueryDTO,
  ) {
    return this.wishlistService.getWishlistItems(userId, query);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async removeFromWishlist(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) wishlistItemId: number,
  ) {
    return this.wishlistService.removeFromWishlist(userId, wishlistItemId);
  }

  @UseGuards(AuthGuard)
  @Delete('/')
  async clearWishlist(@GetUser('id') userId: number) {
    return this.wishlistService.clearWishlist(userId);
  }
}
