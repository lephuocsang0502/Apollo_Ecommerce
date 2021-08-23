import { Category } from "src/category/model/category.interface";
import { Image } from "src/common/Image.interface";
import { User } from "src/user/models/user.interface";

export interface Product {
    id: number
    name: string;
    slug: string;
    price: number;
    quantity: number;
    description: string;
    productPictures: Array<{img:string}>;
    createdAt: Date;
    updatedAt: Date;
    likes: number;
    publishedDate: Date;
    isPublished: boolean;
    category: Category;
    createdBy:User;

}