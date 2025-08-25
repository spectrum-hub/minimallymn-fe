import { Category } from "../../types/Category";

export interface ParentPaths {
  name: string;
  cat_id: number;
}

export function buildCategoryTree(
  categories?: Category[],
  categoryId?: string
): Category[] | undefined {
  const catId = Number(categoryId);

  const categoryMap: Record<number, Category & { children: Category[] }> = {};
  const tree: (Category & { children: Category[] })[] = [];

  if (categories && categories.length > 0) {
    // Initialize the category map
    categories.forEach((category) => {
      categoryMap[category.id] = { ...category, children: [] };
    });

    // Build the tree
    categories.forEach((category) => {
      if (
        Array.isArray(category.parentId) &&
        typeof category.parentId[0] === "number"
      ) {
        const parentId = category.parentId[0];
        if (categoryMap[parentId]) {
          categoryMap[parentId].children.push(categoryMap[category.id]);
        }
      } else {
        tree.push(categoryMap[category.id]);
      }
    });

    // Populate parent paths
    const populateParentPaths = (
      node: Category & { children: Category[] },
      parentPaths: ParentPaths[] = []
    ) => {
      node.parentPaths = [...parentPaths];
      node.children?.forEach((child) => {
        return populateParentPaths(
          child as Category & { children: Category[] },
          [...parentPaths, { name: node.name ?? "", cat_id: node.id }]
        );
      });
    };

    tree.forEach((rootCategory) => {
      populateParentPaths(rootCategory);
    });
  }

  // Recursive search for specific category's children
  const findChildrenRecursively = (
    id: number,
    nodes?: Category[]
  ): Category[] | undefined => {
    for (const node of nodes ?? []) {
      if (node.id === id) {
        return node.children?.length ? node.children : undefined;
      }
      const found = findChildrenRecursively(id, node.children);
      if (found) {
        return found;
      }
    }
    return undefined;
  };

  return catId > 0 ? findChildrenRecursively(catId, tree) : tree;
}
