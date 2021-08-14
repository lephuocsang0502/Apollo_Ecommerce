import { Category } from "src/category/model/category.interface";

export interface User{
    id?: number;
    name?: string;
    username?: string;
    email?:string;
    password?:string;
    role?:UserRole;
    profileImage?:string;
    categoryEntries?: Category[];

}


export enum UserRole{
    ADMIN='admin',
    EDITOR='editor',
    USER='user'
}