import { PageInfo } from "./Products";

interface ParentPaths {
  name: string
  cat_id: number
}

export interface Category {
  id: number;
  name?: string;
  parentId?: number | boolean | [number, string];
  websiteId?: number;
  parentPath?: string;
  sequence: number;
  websiteDescription?: string;
  websiteMetaTitle?: string;
  websiteMetaDescription?: string;
  children?: Category[]
  parentPaths?: ParentPaths[]
  productCount: number;
}

export interface CategoriesQuery {
  categories?: {
    pageInfo?: PageInfo
    categories?: Category[]
  };
}
