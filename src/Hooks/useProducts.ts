// useProducts.ts
import { useCallback } from "react";
import { AttributesList } from "../types/Products";

export interface CombinationIndicesValues {
  combinationIndices: string;
  productId: number | string;
  qtyAvailable: number;
  productTemplateImageIds?: string[];
  productVariantImageIds?: string[];
  // Remove selectedIds from here as it's not part of the original combination
}


export interface PropSelectedProduct {
  productId: number | null;
  selectedCombination?: CombinationIndicesValues; // Made optional to match reality
  selectedIds: string; // Made required since it's always present
  qtyAvailable: number; // Made required since we always provide a fallback
}

export const useCalcPrice = ({
  selectedAttributes,
}: {
  selectedAttributes?: {
    [lineId: string]: AttributesList;
  };
}) => {
  const calcExtraPrice = useCallback(() => {
    return (
      selectedAttributes &&
      Object.values(selectedAttributes).reduce(
        (total, attr) => total + Number(attr.priceExtra ?? 0),
        0
      )
    );
  }, [selectedAttributes]);

  return calcExtraPrice();
};