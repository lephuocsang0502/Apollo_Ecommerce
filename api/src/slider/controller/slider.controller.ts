import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';

import { Observable, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { SLIDER_ENTRIES_URL } from 'src/constant.enum';
import { UserRole } from 'src/user/models/user.interface';
import { Slider } from '../model/slider.interface';
import { SliderService } from '../service/slider.service';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { diskStorage } from 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Image } from 'src/common/Image.interface';
import { join } from 'path';
import { CloudinaryService } from 'src/cloudinary/services/clodinary.service';

export const storage = {
    storage: diskStorage({
        destination: './uploads/slider-image',
        filename: (req, file, cb) => {
            const fileName: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;
            cb(null, `${fileName}${extension}`)
        }
    })

}

@Controller('slider')
export class SliderController {

    constructor(private sliderService: SliderService,
        private cloudyService: CloudinaryService
        ){

    }

    @Get('')
    index(
        @Query('page') page = 1,
        @Query('limit') limit = 10
    ) {
        limit = limit > 100 ? 100 : limit;


        return this.sliderService.paginateAll({
            limit: Number(limit),
            page: Number(page),
            route: SLIDER_ENTRIES_URL
        })
    }

    @UseGuards(JwtAuthGuard)
    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    async create(@Body() sliderEntry: Slider, @UploadedFile() file: Image): Promise<Observable<Slider>> {
        // sliderEntry.img=file.filename;

        if(file){
            const img =await this.cloudyService.uploadImageToCloudinary(file);
            sliderEntry.img = img.url;
        }
        const slider = JSON.parse(JSON.stringify(sliderEntry));
        return this.sliderService.create(slider);

    }


    //@hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard)  
    @Delete(':id')
    deleteOne(@Param('id') id:string):Observable<any>{
        return this.sliderService.deleteOne(Number(id));
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    updateOne(@Param('id') id:string ,@Body() slider:Slider):Observable<any>{
        return this.sliderService.updateOne(Number(id),slider);
    }

    @Get('slider-image/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/slider-image/' + imagename)));
    }


}
