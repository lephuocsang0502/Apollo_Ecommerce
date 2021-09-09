import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UserModule } from 'src/user/user.module';
import { SliderController } from './controller/slider.controller';
import { SliderEntity } from './model/slider.entity';
import { SliderService } from './service/slider.service';

@Module({
    imports:[
        TypeOrmModule.forFeature([SliderEntity]),
        AuthModule,
        UserModule,
        CloudinaryModule
    ],
    controllers:[SliderController],
    providers:[SliderService]
})
export class SliderModule {}
