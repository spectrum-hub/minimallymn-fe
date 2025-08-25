import { ButtonColorType, ButtonVariantType } from "antd/es/button";
import { AttributesList } from "../../types/Products";
import { PropSelectedProduct } from "../../Hooks/useProducts";

export const groupAttribute = (attributesList: AttributesList[] = {} as AttributesList[]) => {
  return attributesList.reduce<{ [key: string]: AttributesList[] }>((acc, item) => {
    if (!acc[item.attributeLineId]) {
      acc[item.attributeLineId] = [];
    }
    acc[item.attributeLineId].push(item);
    return acc;
  }, {});
};

export const isActiveAttribute = (
  isSelected?: boolean
): {
  variant: ButtonVariantType;
  color: ButtonColorType;
} => {
  return {
    variant: isSelected ? "outlined" : "dashed",
    color: isSelected ? "primary" : "default",
  };
};

export const isVariantActive = (
  selectedProduct?: PropSelectedProduct
): boolean => {
  return (
    !!selectedProduct?.selectedCombination &&
    Number(selectedProduct?.productId) > 0
  );
};




type DisplayType = "select" | "radio" | "color" | "multi" | "brand";

export interface Attribute {
  id: number;
  name: string;
  sequence: number;
  attributeId: string[] | undefined;
  color: number;
  htmlColor: boolean;
  active: boolean;
  defaultExtraPrice: number;
  displayType: DisplayType;
}



export const groupByAttributeId = (items?: Attribute[]) => {
  const groupedObject: Record<
    string,
    {
      name: string;
      displayType: DisplayType;
      items: Record<number, Attribute>;
    }
  > = {};

  for (let i = 0; i < (items?.length ?? 0); i++) {
    const item = (items ?? [])[i];
    const attributeId = item.attributeId?.[0]; // Get the first attributeId
    if (attributeId) {
      if (!groupedObject[attributeId]) {
        groupedObject[attributeId] = {
          name: item.attributeId?.[1] ?? "",
          displayType: item.displayType,
          items: {},
        };
      }
      groupedObject[attributeId].items[item.id] = item;
    }
  }

  return groupedObject;
};