import { GET_PRODUCTS } from "../../api";
import { ProductsQuery } from "../../types/Products";
import { FC } from "react";
import { Block } from "../../types/Blocks";
import { BLOCK_PRODUCTS_DEFAULT_TOTAL } from "../../Constants";
import ProductItemCard from "./ProductItemCard";
import useGqlQuery from "../../Hooks/Query";

/**
 *
 *
 * ----------------------
 * | BlockProducts     |
 * ----------------------
 *
 *
 *
 */

interface BlockProductsProps {
  block?: Block;
}

const BlockProducts: FC<BlockProductsProps> = ({ block }) => {

  const catId =
    block?.data_product_category_id !== "all" &&
    Number(block?.data_product_category_id) > 0
      ? Number(block?.data_product_category_id)
      : null;
  const { loading, error, data } = useGqlQuery<ProductsQuery>(GET_PRODUCTS, {
    page: 1,
    pageSize:
      Number(block?.data_number_of_elements) || BLOCK_PRODUCTS_DEFAULT_TOTAL,
    categoryId: catId ?? undefined,
    // name: 1,
    // minPrice: 1,
    // maxPrice: 1,
    // type: 1,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <section className={`${block?.data_name} max-w-7xl mx-auto `}>
      <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
      <div
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 
        gap-1 md:gap-2
      "
      >
        {(data?.products?.items ?? []).map((item) => (
          <ProductItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default BlockProducts;
