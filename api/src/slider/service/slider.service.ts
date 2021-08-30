import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import slugify from 'slugify';
import { Repository } from 'typeorm';
import { SliderEntity } from '../model/slider.entity';
import { Slider } from '../model/slider.interface';

@Injectable()
export class SliderService {

    constructor(
        @InjectRepository(SliderEntity) private readonly sliderRepository:Repository<SliderEntity>
    ){}

    create(slider: Slider):Observable<Slider>{
        return this.generateSlug(slider.title).pipe(
            switchMap((slug:string)=>{
                slider.path=`category/${slug}`;
                return from(this.sliderRepository.save(slider));
            })
        )
        
    }
    generateSlug(title: string) {
        return of(slugify(title));
    }
    paginateAll(options: IPaginationOptions): Observable<Pagination<Slider>> {
        return from(paginate<Slider>(this.sliderRepository, options, {
            relations: []
        })).pipe(
            map((sliderEntries: Pagination<Slider>) => sliderEntries)
        )
    }
    updateOne(id: number, slider: Slider): Observable<Slider> {

        return from(this.sliderRepository.update(id,slider)).pipe(
            switchMap(()=>this.findOne(id))
        );
    }
    findOne(id: number): Observable<Slider> {
        return from(this.sliderRepository.findOne(id));
    }
    deleteOne(id: number): Observable<any> {
        return from(this.sliderRepository.delete(id));
    }
   
}
