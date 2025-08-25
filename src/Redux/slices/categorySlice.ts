import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoriesQuery, Category } from "../../types/Category";

interface CategoryState {
  data: CategoriesQuery | null;
  categoriesTree?: Category[] | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  success?: boolean;
}

const initialState: CategoryState = {
  data: null,
  loading: false,
  error: null,
  message: null,
  success: false,
  categoriesTree: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategoriesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    setCategoriesSuccess: (
      state,
      action: PayloadAction<CategoriesQuery | null>
    ) => {
      const data = action.payload;
      const treeCategories = data ?  makeCategoryTree(data) : null
      state.data = data;
      state.loading = false;
      state.categoriesTree = treeCategories
    },
    setCategoriesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.message = action.payload;
    },
  },
});

export const {
  setCategoriesRequest,
  setCategoriesSuccess,
  setCategoriesFailure,
} = categorySlice.actions;
export default categorySlice.reducer;

const makeCategoryTree = (data?: CategoriesQuery) => {
  if (!data?.categories?.categories) return [];

  const categories: Category[] = data.categories.categories;

  // Create a map of categories by their ID
  const categoryMap: Record<number, Category> = {};
  categories.forEach((category) => {
    categoryMap[category.id] = { ...category, children: [] };
  });

  // Build the tree structure
  const tree: Category[] = [];
  categories?.forEach((category) => {
    if (category.parentId && typeof category.parentId === "number") {
      const parent = categoryMap[category.parentId];
      if (parent) {
        parent.children?.push(categoryMap[category.id]);
      }
    } else {
      tree.push(categoryMap[category.id]); // Root categories
    }
  });

  return tree;
};
