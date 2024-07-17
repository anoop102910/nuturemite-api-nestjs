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
import { CartService } from './cart.service';
import { CartQueryDTO, CreateCartItemDTO, UpdateCartItemDTO } from './cart.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';

@Controller('api/cartitems')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  async addToCart(
    @GetUser('id') userId: number,
    @Body() data: CreateCartItemDTO,
  ) {
    return this.cartService.addToCart(userId, data);
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async getCartItems(
    @GetUser('id') userId: number,
    @Query() query: CartQueryDTO,
  ) {
    return this.cartService.getCartItems(userId, query);
  }

  
  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateCartItem(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) cartItemId: number,
    @Body() data: UpdateCartItemDTO,
  ) {
    return this.cartService.updateCartItem(cartItemId, data);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async removeFromCart(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) cartItemId: number,
  ) {
    return this.cartService.removeFromCart(userId, cartItemId);
  }

  @UseGuards(AuthGuard)
  @Delete('/')
  async clearCart(@GetUser('id') userId: number) {
    return this.cartService.clearCart(userId);
  }
}
