import { User } from "src/user/models/user.interface";

export interface Category{
    id?: number
    name?: string;
    slug?: string;
    type?: string;
    categoryImage?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: User;
    parent:Category;
    children:Category[];
}

