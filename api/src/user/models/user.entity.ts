import { CategoryEntity } from "src/category/model/category.entity";
import { ProductEntity } from "src/product/models/product.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./user.interface";

@Entity()
export class UserEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()

    @Column()
    name:string;

    //unique là duy nhất, không trùng nhau
    @Column({unique:true})

    username:string;

    @Column()
    email:string;

    @Column({select:false})
    password:string;

    @Column({type:'enum',enum:UserRole,default:UserRole.USER})
    role:UserRole; 

    @Column({nullable:true})
    profileImage:string;

    @OneToMany(type=>CategoryEntity, categorEntryEntity=>categorEntryEntity.createdBy)
    categoryEntries: CategoryEntity[];

    
    @OneToMany(type=>ProductEntity, productEntryEntity=>productEntryEntity.createdBy)
    productEntries: ProductEntity[];

    // @OneToMany(type=>CartEntity, cartEntity=>cartEntity.user)
    // cartEntries: CartEntity[];

    @BeforeInsert()
    emailToLowerCase(){
        this.email=this.email.toLowerCase();
    }
}