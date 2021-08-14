import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import slugify from 'slugify';
import { User } from 'src/user/models/user.interface';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../model/category.entity';
import { Category } from '../model/category.interface';

@Injectable()
export class CategoryService {
    
    paginateAll(options: IPaginationOptions): Observable<Pagination<CategoryEntity>> {
        return from(paginate<CategoryEntity>(this.categoryRepository, options, {
            relations: ['createdBy']
        })).pipe(
            map((categoryEntries: Pagination<CategoryEntity>) => categoryEntries)
        )
    }

    constructor(
        @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
        private userService:UserService
    ){}
    
    create(user:User, categoryEntry: Category):Observable<Category> {
       categoryEntry.createdBy=user;
       return this.generateSlug(categoryEntry.name).pipe(
           switchMap((slug: string)=>{
                categoryEntry.slug=slug;
                return from(this.categoryRepository.save(categoryEntry));
           }),
           catchError(err => throwError(err))
       )
    }

    generateSlug(name:string): Observable<string>{
        return of(slugify(name));
    }

    deleteOne(id: number): Observable<any> {
        return from(this.categoryRepository.delete(id));
    }
    updateOne(id: number, category: Category): Observable<Category> {

        return from(this.categoryRepository.update(id,category)).pipe(
            switchMap(()=>this.findOne(id))
        );
    }
    findOne(id: number): Observable<Category> {
        return from(this.categoryRepository.findOne({id},{relations:['createdBy']}));
    }
}
