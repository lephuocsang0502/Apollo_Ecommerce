import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { UserEntity } from "src/user/models/user.entity";
import { CategoryEntity } from "src/category/model/category.entity";
import { Image } from "src/common/Image.interface";

@Entity('product_entity')
export class ProductEntity{

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name:string;

    @Column()
    slug:string;

    @Column()
    price: number;

    @Column()
    quantity:number;

    @Column({default: ''})
    description:string;

    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
    })
    productPictures: Array<{img:string}>;

    @Column({type:'timestamp',default: ()=>"CURRENT_TIMESTAMP"})
    createdAt:Date;

    @Column({type:'timestamp',default: ()=>"CURRENT_TIMESTAMP"})
    updatedAt:Date;

    @BeforeUpdate()
    updateTimestamp(){
        this.updatedAt=new Date;
    }

    @Column({default:0})
    likes:number;


    @Column({nullable:true})
    publishedDate:Date;

    @Column({nullable:true})
    isPublished:boolean;

    
    @ManyToOne(type => UserEntity, user => user.productEntries)
    createdBy: UserEntity
    
    @ManyToOne(type=> CategoryEntity,category=>category.productEntries)
    category: CategoryEntity


    
}