import { Module } from '@nestjs/common';
import { AuthModule } from './api services/auth/auth.module';
import { PrismaModule } from './core services/prisma/prisma.module';
// import { UserModule } from './api services/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MinioModule } from './core services/minio/minio.module';
// import { RedisModule } from './redis/redis.module';
import { CategoryModule } from './api services/category/category.module';
import { BrandModule } from './api services/brand/brand.module';
import { CloudinaryModule } from './core services/cloud-upload/cloud.module';
import { ProductModule } from './api services/product/product.module';
import { CartModule } from './api services/cart/cart.module';
// import { OrderModule } from './api services/order/order.module';
// import { AddressModule } from './api services/address/address.module';
import { WishlistModule } from './api services/wishlist/wishlist.module';

@Module({
  imports: [
    AuthModule,
    // UserModule,
    CategoryModule,
    BrandModule,
    ProductModule,
    CartModule,
    // OrderModule,
    // AddressModule,
    WishlistModule,

    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    // RedisModule,
    MinioModule,
    CloudinaryModule
  ],
})
export class AppModule {}

