import { FC } from "react";
import { GridRow } from "../../types";
import { baseURL } from "../../lib/configs";
import useGqlQuery from "../../Hooks/Query";
import { ProductsQuery } from "../../types/Products";
import { GET_PRODUCTS } from "../../api";
import { PRODUCTS_SCREEN_DEFAULT_TOTAL } from "../../Constants";
import ProductItemCard from "../Products/ProductItemCard";

interface Props {
  row?: GridRow;
  isMobile?: boolean
}

const BlockCategories: FC<Props> = ({ row, isMobile }) => {
  // "itemViewType": "item_products",

  // Get category IDs from row items
  const cidIds =
    row?.itemViewType === "item_products"
      ? (row?.rowItems ?? [])
          .flatMap((item) => item.itemId)
          .filter((id): id is number => typeof id === "number")
      : [];

  console.log({ cidIds });

  // Fetch products when cidIds exist - hook must be at top level
  const { loading, error, data } = useGqlQuery<ProductsQuery>(
    GET_PRODUCTS,
    {
      page: 1,
      pageSize: PRODUCTS_SCREEN_DEFAULT_TOTAL,
      orderBy: "create_date desc",
      filters: {
        cids: cidIds,
      },
    },
    {
      context: {
        api: "minimally",
      },
      skip: row?.itemViewType !== "item_products" || cidIds.length === 0, // Only run query when itemViewType is "item_products" and cidIds exist
    }
  );

  if (row?.itemViewType === "item_products") {
    console.log(data?.products?.items);

    if (loading) {
      return (
        <section className="mx-auto">
          <div className="animate-pulse">Loading products...</div>
        </section>
      );
    }

    if (error) {
      return (
        <section className="mx-auto">
          <div className="text-red-500">Error loading products</div>
        </section>
      );
    }

    // Render products from API if available
    if (data?.products?.items && data.products.items.length > 0) {
      return (
        <section className="mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.products.items.map((item, index) => (
              <ProductItemCard
                key={index}
                item={item}
                isMobile={isMobile}
              />
            ))}
          </div>
        </section>
      );
    }

    // Fallback to row items if no products from API
    return (
      <section className="mx-auto">
        {(row?.rowItems ?? []).map((item, index) => (
          <div key={index}>
            <img
              src={`${baseURL}${item?.itemImage?.large}`}
              alt={item?.itemTitle || ""}
              className="h-14 w-20 object-cover rounded-md"
            />
            <h2>{item?.itemId}</h2>
            <h2>{item?.itemName}</h2>
          </div>
        ))}
      </section>
    );
  }
  return (
    <section className={` mx-auto `}>
      {(row?.rowItems ?? []).map((item, index) => (
        <div key={index}>
          <img
            key={index}
            src={`${baseURL}${item?.itemImage?.large}`}
            alt={item?.itemTitle || ""}
            className="
              h-14 w-20 object-cover  rounded-md 
            "
          />
          <h2>{item?.itemId}</h2>
          <h2>{item?.itemName}</h2>
        </div>
      ))}
    </section>
  );
};

export default BlockCategories;
