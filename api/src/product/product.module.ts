import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CategoryModule } from 'src/category/category.module';
import { UserModule } from 'src/user/user.module';
import { ProductController } from './controller/product.controller';
import { ProductEntity } from './models/product.entity';
import { ProductService } from './service/product.service';

@Module({

  imports:[
    TypeOrmModule.forFeature([ProductEntity]),
    AuthModule,
    UserModule,
    CategoryModule
],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
