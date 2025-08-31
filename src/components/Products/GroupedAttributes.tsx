import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (initialVariantProductId && (parentProducts ?? [])?.length > 0) {
      const initialVariant = parentProducts?.find(
        (product) => Number(product.id) === Number(initialVariantProductId)
      );

      if (initialVariant) {
        const initialAttributes =
          initialVariant.productTemplateAttributeValueIds.reduce(
            (acc, attr) => {
              acc[attr.productAttributeValueId.attributeId.id] =
                attr.productAttributeValueId.id;
              return acc;
            },
            {} as Record<number, number>
          );

        setSelectedAttributes(initialAttributes);
      }
    }
    // 🔥 шинэ логик: attribute group нь 1 л утгатай бол автоматаар сонгоно
    Object.entries(groupedAttributes).forEach(([attributeId, attributes]) => {
      if (attributes?.values?.length === 1) {
        const onlyValue = attributes.values[0];
        setSelectedAttributes((prev) => ({
          ...prev,
          [Number(attributeId)]: onlyValue.id,
        }));
      }
    });
  }, [groupedAttributes, initialVariantProductId, parentProducts]);

  const handleSelect = (attributeId: number, valueId: number) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeId]: prev[attributeId] === valueId ? null : valueId,
    }));
  };

  const findSelectedVariant = (
    selectedAttributes: Record<number, number | null>,
    parentProducts?: ParentProduct[]
  ) => {
    return parentProducts?.find((product) => {
      const productAttributeValues =
        product.productTemplateAttributeValueIds.map(
          (attr) => attr.productAttributeValueId.id
        );

      return Object.values(selectedAttributes).every(
        (selectedValueId) =>
          selectedValueId && productAttributeValues.includes(selectedValueId)
      );
    });
  };

  const selectedVariant = findSelectedVariant(
    selectedAttributes,
    parentProducts
  );
  const totalAttributes = Object.keys(groupedAttributes).length;

  useEffect(() => {
    if (
      selectedVariant?.id &&
      totalAttributes === Object.keys(selectedAttributes).length &&
      (parentProducts ?? []).length > 0
    ) {
      const paramsObj = Object.fromEntries(searchParams.entries());

      setSearchParams({
        ...paramsObj,
        attributeId: selectedVariant.id.toString(),
      });
    }
  }, [
    parentProducts,
    searchParams,
    selectedAttributes,
    selectedVariant,
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

          <div className="flex flex-wrap  gap-2 my-0 attribute-buttons">
            {attributes?.values?.map((attr) => {
              const isSelected =
                selectedAttributes[Number(attributeId)] === attr.id;
              return (
                <Button
                  key={attr.id}
                  onClick={() => handleSelect(Number(attributeId), attr.id)}
                  aria-pressed={isSelected}
                  aria-label={`Select ${attr.name} variant`}
                  type={isSelected ? "primary" : "default"}
                  className={`add-price-${attr.id} ${
                    attr.attributeId?.displayType === "color"
                      ? ` flex flex-col justify-center items-center gap-1 
                          md:gap-2 h-full max-w-[120px] p-1 `
                      : ` `
                  }`}
                >
                  {attr.attributeId.displayType === "color" ? (
                    <>
                      <img
                        src={imageBaseUrl(attr.productVariantId, "image_512")}
                        alt={attr.name}
                        className="h-14 md:h-20 object-contain block "
                      />
                      <span className="
                        text-xs text-wrap text-center 
                        leading-[15px] block h-8
                        line-clamp-2 max-w-20
                        ">
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
    <div className="flex items-center gap-2 my-1 ">
      <h3
        className={`text-sm text-gray-600 font-bold whitespace-nowrap ${className}`}
      >
        {title}
      </h3>
      <div className="flex-grow border-t border-gray-200"></div>
    </div>
  );
};
