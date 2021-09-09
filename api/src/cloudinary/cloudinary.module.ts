
import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './controllers/cloudinary';
import { CloudinaryService } from './services/clodinary.service';



@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}