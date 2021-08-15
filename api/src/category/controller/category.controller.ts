import { Body, Controller, Post, UseGuards, Request, Get, Put, Delete, Param, UseInterceptors, UploadedFile, Res, Query } from '@nestjs/common';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { Observable, of } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guards';
import { Category } from '../model/category.interface';
import { CategoryService } from '../service/category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { Image } from 'src/common/Image.interface';
import { CATEGORY_ENTRIES_URL } from 'src/constant.enum';



export const storage = {
    storage: diskStorage({
        destination: './uploads/category-image',
        filename: (req, file, cb) => {
            const fileName: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;
            cb(null, `${fileName}${extension}`)
        }
    })

}

@Controller('category')
export class CategoryController {

    constructor(private categoryService: CategoryService) { }


    @UseGuards(JwtAuthGuard)
    @Get('')
    index(
        @Query('page') page = 1,
        @Query('limit') limit = 10
    ) {
        limit = limit > 100 ? 100 : limit;


        return this.categoryService.paginateAll({
            limit: Number(limit),
            page: Number(page),
            route: CATEGORY_ENTRIES_URL
        })
    }

    @UseGuards(JwtAuthGuard)
    @Post('')
    create(@Body() categoryEntry: Category, @Request() req): Observable<Category> {
        console.log(categoryEntry);
        const user = req.user;
        return this.categoryService.create(user, categoryEntry);
    }

    @Get(':id')
    findOne(@Param('id') id: number): Observable<Category> {
        return this.categoryService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    updateOne(@Param('id') id: number, @Body() category: Category): Observable<Category> {
        return this.categoryService.updateOne(Number(id), category);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteOne(@Param('id') id: number): Observable<any> {
        return this.categoryService.deleteOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('image/upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file, @Request() req): Observable<Image> {
        return of(file);

    }

    @Get('image/:imagename')

    findImage(@Param('imagename') imagename, @Res() res): Observable<object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/category-image/' + imagename)));
    }
}
