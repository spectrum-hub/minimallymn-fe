import React, { useEffect, useMemo, useState } from "react";
import { Button } from "antd";
import { useSearchParams } from "react-router";
import { imageBaseUrl } from "../../lib/configs";
import {
  GroupedAttrbutesProps,
  ParentProduct,
} from "../../types/ProductDetail";

interface Props {
  groupedAttributes: GroupedAttrbutesProps;
  parentProducts?: ParentProduct[]; // Бүтээгдэхүүний variant-ууд
}

const GroupedAttributes: React.FC<Props> = ({
  groupedAttributes,
  parentProducts,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialVariantProductId = searchParams.get("attributeId");

  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<number, number | null>
  >({});

  // Анхны сонголт: URL-д ирсэн variant + 1 утгатай аттрибутуудыг нэг дор сонгоно
  useEffect(() => {
    let next: Record<number, number> = {};

    // a) URL-ийн variant-тай тааруулж attribute-value-г сэргээх
    if (initialVariantProductId && (parentProducts ?? []).length > 0) {
      const initialVariant = parentProducts?.find(
        (product) => Number(product.id) === Number(initialVariantProductId)
      );

      if (initialVariant) {
        next = initialVariant.productTemplateAttributeValueIds.reduce(
          (acc, attr) => {
            acc[attr.productAttributeValueId.attributeId.id] =
              attr.productAttributeValueId.id;
            return acc;
          },
          {} as Record<number, number>
        );
      }
    }

    // b) Нэг л утгатай аттрибутуудыг автоматаар сонгох
    for (const [attributeId, attributes] of Object.entries(groupedAttributes)) {
      if (attributes?.values?.length === 1) {
        const onlyValue = attributes.values[0];
        next[Number(attributeId)] = onlyValue.id;
      }
    }

    // next-т өөрчлөлт байгаа үед л state шинэчлэх
    setSelectedAttributes((prev) => {
      const sameLen =
        Object.keys(next).length === Object.keys(prev).length;
      const sameVals =
        sameLen &&
        Object.entries(next).every(([k, v]) => prev[Number(k)] === v);
      return sameVals ? prev : { ...prev, ...next };
    });
  }, [groupedAttributes, initialVariantProductId, parentProducts]);

  // Сонголтын логик:
  // - URL-д attributeId байвал: ижил утгыг дахин дарсан ч унтраахгүй (заавал нэг нь идэвхтэй).
  // - Эс тэгвээс: toggle хэвээр (дахин дарвал null болгоно).
  const handleSelect = (attributeId: number, valueId: number) => {
    setSelectedAttributes((prev) => {
      const isSame = prev[attributeId] === valueId;

      if (initialVariantProductId) {
        // URL-ээр ирсэн үед: дахин дарвал унтраахгүй
        return isSame ? prev : { ...prev, [attributeId]: valueId };
      }

      // Эсрэг тохиолдолд: toggle
      return { ...prev, [attributeId]: isSame ? null : valueId };
    });
  };

  // Сонгосон аттрибутуудтай яг таарах variant-ыг олох
  const selectedVariant = useMemo(() => {
    if (!parentProducts || !Object.keys(selectedAttributes).length) return undefined;
    return parentProducts.find((product) => {
      const productAttributeValues = product.productTemplateAttributeValueIds.map(
        (attr) => attr.productAttributeValueId.id
      );
      return Object.values(selectedAttributes).every(
        (selectedValueId) =>
          selectedValueId && productAttributeValues.includes(selectedValueId)
      );
    });
  }, [parentProducts, selectedAttributes]);

  const totalAttributes = Object.keys(groupedAttributes).length;

  // Бүх аттрибут сонгогдсон үед URL-ийн attributeId-г sync хийх
  useEffect(() => {
    if (
      selectedVariant?.id &&
      totalAttributes === Object.keys(selectedAttributes).length &&
      (parentProducts ?? []).length > 0
    ) {
      const paramsObj = Object.fromEntries(searchParams.entries());
      const nextId = String(selectedVariant.id);
      if (paramsObj.attributeId !== nextId) {
        setSearchParams({ ...paramsObj, attributeId: nextId });
      }
    }
  }, [
    parentProducts,
    searchParams,
    selectedAttributes,
    selectedVariant?.id,
    setSearchParams,
    totalAttributes,
  ]);

  if (!parentProducts || !groupedAttributes) {
    return <div>Ачааллаж байна...</div>;
  }

  return (
    <div className="w-full bg-white pr-4 p-0 pb-1 rounded-md cart-action-buttons">
      {Object.entries(groupedAttributes).map(([attributeId, attributes]) => (
        <div key={attributeId} className="my-4">
          <TitleLined title={attributes?.attribute?.name} />

          <div className="flex flex-wrap gap-2 my-0 attribute-buttons">
            {attributes?.values?.map((attr) => {
              const isSelected =
                selectedAttributes[Number(attributeId)] === attr.id;

              const isColor = attr.attributeId?.displayType === "color";

              return (
                <Button
                  key={attr.id}
                  onClick={() => handleSelect(Number(attributeId), attr.id)}
                  aria-pressed={isSelected}
                  aria-label={`Select ${attr.name} variant`}
                  type={isSelected ? "primary" : "default"}
                  className={`add-price-${attr.id} ${
                    isColor
                      ? `flex flex-col justify-center items-center gap-1 md:gap-2 h-full max-w-[120px] p-1`
                      : ``
                  }`}
                >
                  {isColor ? (
                    <>
                      <img
                        src={imageBaseUrl(attr.productVariantId, "image_512")}
                        alt={attr.name}
                        className="h-14 md:h-20 object-contain block"
                      />
                      <span
                        className="
                          text-xs text-wrap text-center
                          leading-[15px] block h-8
                          line-clamp-2 max-w-20
                        "
                      >
                        {attr.name}
                      </span>
                    </>
                  ) : (
                    attr.name
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupedAttributes;

interface TitleLinedProps {
  title?: string;
  className?: string;
}

const TitleLined: React.FC<TitleLinedProps> = ({ title, className }) => {
  return (
    <div className="flex items-center gap-2 my-1">
      <h3
        className={`text-sm text-gray-600 font-bold whitespace-nowrap ${className ?? ""}`}
      >
        {title}
      </h3>
      <div className="flex-grow border-t border-gray-200"></div>
    </div>
  );
};
