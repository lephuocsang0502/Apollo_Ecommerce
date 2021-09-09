import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { from, Observable, of } from 'rxjs';
import {  map, switchMap } from 'rxjs/operators';
import slugify from 'slugify';
import { CloudinaryService } from 'src/cloudinary/services/clodinary.service';
import { Image } from 'src/common/Image.interface';

import { User } from 'src/user/models/user.interface';

import { Repository } from 'typeorm';
import { ProductEntity } from '../models/product.entity';
import { Product } from '../models/product.interface';

@Injectable()
export class ProductService {    
    constructor(
        @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
        private cloudinary: CloudinaryService
    ){}
    
    paginateByCatogory(options: IPaginationOptions, cateogryId: number): Observable<Pagination<Product>> {
        return from(paginate<Product>(this.productRepository, options, {
            relations: ['category'],
            where: [
                {category: cateogryId}
            ]
        })).pipe(
            map((productEntries: Pagination<Product>) => productEntries)
        )
    }

    findAll(): Observable<Product[]> {
        return from(this.productRepository.find({relations: ['category']}));
    }

    deleteOne(id: number): Observable<any> {
        return from(this.productRepository.delete(id));
    }
    updateOne(id: number, product: Product): Observable<Product> {

        return from(this.productRepository.update(id,product)).pipe(
            switchMap(()=>this.findOne(id))
        );
    }
    findOne(id: number): Observable<Product> {
        return from(this.productRepository.findOne({id},{relations:['category']}));
    }

    findByCategory(categoryId: number): Observable<Product[]> {
        return from(this.productRepository.find({
            where: {
                category: categoryId
            },
            relations: ['category']
        })).pipe(map((categoryEntries: Product[]) => categoryEntries))
    }


    generateSlug(name:string): Observable<string>{
        return of(slugify(name));
    }
  
    async create(user: User, productEntry: Product,files:Image[]): Promise<Observable<Product>> {
        console.log(files);
        const urls = [];
        for (const file of files) {
         
          const newPath = await this.cloudinary.uploadImageToCloudinary(file);
          urls.push(newPath);
        }
  
        
        productEntry.createdBy = user;
        return this.generateSlug(productEntry.name).pipe(
            switchMap((slug: string) => {
                console.log(urls);
                productEntry.slug = slug;
                productEntry.productPictures =  urls.map(url => url.url);
                return from(this.productRepository.save(productEntry))
            })
        )
    }
    paginateAll(options: IPaginationOptions): Observable<Pagination<Product>> {
        return from(paginate<Product>(this.productRepository, options, {
            relations: ['category']
        })).pipe(
            map((requestEntries: Pagination<Product>) => requestEntries)
        )
    }
}
