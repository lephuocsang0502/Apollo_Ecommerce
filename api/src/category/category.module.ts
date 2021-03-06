import { Module } from '@nestjs/common';
import { CategoryService } from './service/category.service';
import { CategoryController } from './controller/category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './model/category.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([CategoryEntity]),
    AuthModule,
    UserModule,
    CloudinaryModule
  ],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}
