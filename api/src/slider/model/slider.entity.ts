import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SliderEntity{


    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    title: string;

    @Column()
    description: string;

    @Column()
    img: string;

    @Column({nullable:true})
    color: string;

    @Column()
    path: string;

}