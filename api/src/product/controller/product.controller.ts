import { Body, Controller, Get, Query, UseGuards,Request, Post, Param, Put, Delete, UploadedFile, Res, UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guards';
import { ProductService } from '../service/product.service';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { Product } from '../models/product.interface';
import { Observable, of } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { Image } from 'src/common/Image.interface';
import { PRODUCT_ENTRIES_URL } from 'src/constant.enum';





export const storage = {
    storage: diskStorage({
        destination: './uploads/product-image', 
        filename: (req, file, cb) => {     
          const fileName :string = path.parse(file.originalname).name.replace(/\s/g,'')+ uuidv4();
          const extension:string = path.parse(file.originalname).ext;
          cb(null, `${fileName}${extension}`)
          }
      })         

}

@Controller('product')
export class ProductController {

    constructor(private productService:ProductService) {}


    @UseGuards(JwtAuthGuard)
    @Get('')
    index(
        @Query('page') page = 1,
        @Query('limit') limit = 10
    ) {
        limit = limit > 100 ? 100 : limit;
        

        return this.productService.paginateAll({
            limit: Number(limit),
            page: Number(page),
            route: PRODUCT_ENTRIES_URL
        })
    }

    @Get('product/:category')
    indexByUser(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Param('category') cateogryId: number
    ) {
        limit = limit > 100 ? 100 : limit;

        return this.productService.paginateByCatogory({
            limit: Number(limit),
            page: Number(page),
            route:PRODUCT_ENTRIES_URL  + '/category/' + cateogryId 
        }, Number(cateogryId))
    }


    @UseGuards(JwtAuthGuard)
    @Post('')
    create(@Body() productEntry: Product, @Body()categoryId:number, @Request() req):Observable<Product>  {
        const user = req.user;
        return this.productService.create(user,productEntry);
    }

    @Get(':id')
    findOne(@Param('id') id: number): Observable<Product> {
        return this.productService.findOne(id);
    }
    @Get('category/:id')
    findByCategory(@Param('id') id: number): Observable<Product[]> {
        return this.productService.findByCategory(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    updateOne(@Param('id') id: number, @Body() product: Product): Observable<Product> {
        return this.productService.updateOne(Number(id), product);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteOne(@Param('id') id: number): Observable<any> {
        return this.productService.deleteOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('image/upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile()file ,@Request() req): Observable<Image>{
        return of(file);
     
    }

    @Get('image/:imagename')
    findImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/product-image/' + imagename)));
    }

}
