import { FC, useEffect, useState } from "react";
import { NProductDetail } from "../../types/ProductDetail";

interface ProductDetails {
  product?: NProductDetail;
  selectedProductId?: number;
  setSelectedPriceForLoan: (price: number) => void;
}

const RenderPrice: FC<ProductDetails> = ({
  product,
  selectedProductId,
  setSelectedPriceForLoan,
}) => {
  const [calcPrice, setCalcPrice] = useState<number | null>(null);

  // Default утгуудыг тодорхой тавиад, Number conversion-ыг энд хийнэ
  const basePrice = Number(product?.listPrice) || 0;
  const standardPrice = Number(product?.standardPrice) || 0;
  const discountDifference = standardPrice - basePrice;
  const discountPercentage =
    standardPrice > basePrice && standardPrice > 0
      ? (discountDifference * 100) / standardPrice
      : 0;

  useEffect(() => {
    const parentProducts = product?.parentProducts ?? [];

    if (parentProducts.length > 0) {
      // Анхны үнийг тохируулах
      const firstVariantPrice = basePrice + Number(parentProducts[0]?.priceExtra || 0);
      setSelectedPriceForLoan(firstVariantPrice);

      if (selectedProductId) {
        const selectedVariant = parentProducts.find(
          (parentProduct) => Number(parentProduct.id) === Number(selectedProductId)
        );
        if (selectedVariant) {
          const variantPrice = basePrice + Number(selectedVariant.priceExtra || 0);
          setCalcPrice(variantPrice);
          setSelectedPriceForLoan(variantPrice);
        } else {
          setCalcPrice(firstVariantPrice);
        }
      } else {
        setCalcPrice(firstVariantPrice);
      }
    } else {
      setCalcPrice(basePrice);
      setSelectedPriceForLoan(basePrice);
    }
  }, [product, selectedProductId, basePrice, setSelectedPriceForLoan]);

  // calcPrice null эсвэл 0 байвал рендер хийхгүй
  if (!calcPrice || calcPrice === 0) {
    return null; // Early return-ийн тулд null ашиглав
  }

  return (
    <div className="flex flex-col mb-2">
      <span className="text-gray-600">
        Үнэ:
        {discountDifference > 0 && (
          <span className="text-sm"> (Хямдралтай)</span>
        )}
      </span>
      <div className="flex items-center gap-4 my-1">
        <h2 className="text-xl md:text-2xl font-bold p-0 m-0">
          {calcPrice.toLocaleString()} ₮
        </h2>
        {discountDifference > 0 && standardPrice > 0 && (
          <h3 className="line-through font-normal text-md">
            {standardPrice.toLocaleString()} ₮
          </h3>
        )}
      </div>
      {discountDifference > 0 && (
        <h4 className="text-red-600 my-2 text-sm font-semibold">
          Хэмнэлт: {discountDifference.toLocaleString()} ₮ (
          {discountPercentage.toFixed(0)}%)
        </h4>
      )}
    </div>
  );
};

export default RenderPrice;