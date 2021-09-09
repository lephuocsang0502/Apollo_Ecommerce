import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import slugify from 'slugify';
import { UserEntity } from 'src/user/models/user.entity';
import { User } from 'src/user/models/user.interface';
import { UserService } from 'src/user/service/user.service';
import { getManager, Repository } from 'typeorm';
import { CategoryEntity } from '../model/category.entity';
import { Category } from '../model/category.interface';

@Injectable()
export class CategoryService {

    paginateAll(options: IPaginationOptions): Observable<Pagination<CategoryEntity>> {
        return from(paginate<CategoryEntity>(this.categoryRepository, options, {
            relations: ['children','parent']
        })).pipe(
            map((categoryEntries: Pagination<CategoryEntity>) => categoryEntries)
        )
    }

    constructor(
        @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
        private userService: UserService
    ) { }

    create(user: User, categoryEntry: Category): Observable<Category> {
        const manager = getManager();
        categoryEntry.createdBy = user;
        if (categoryEntry.parent != null) {
            this.categoryRepository.findOne(categoryEntry.parent).then(cate=>{
                categoryEntry.parent=cate;
            })
         }
        return this.generateSlug(categoryEntry.name).pipe(
            switchMap((slug: string) => {
                categoryEntry.slug = slug;
                console.log(categoryEntry);
                return from(this.categoryRepository.save(categoryEntry)).pipe(
                    switchMap((categoryEntry:Category) =>{
                        const cate = new CategoryEntity();
                        Object.assign(cate,categoryEntry);
                        return manager.save(cate)
                    })
                )
            })
        )
    }
    async getTreeCate(){
        const manager =getManager();
        const trees = await manager.getTreeRepository(CategoryEntity).findTrees();
        console.log(trees);
        return trees;
    }


    generateSlug(name: string): Observable<string> {
        return of(slugify(name));
    }

    deleteOne(id: number): Observable<any> {
        return from(this.categoryRepository.delete(id));
    }
    updateOne(id: number, category: Category): Observable<Category> {

        return from(this.categoryRepository.update(id, category)).pipe(
            switchMap(() => this.findOne(id))
        );
    }
    findOne(id: number): Observable<Category> {
        return from(this.categoryRepository.findOne({ id }, { relations: ['parent'] }));
    }
}
