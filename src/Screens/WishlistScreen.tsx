import { useState, useEffect } from "react";
import useGqlQuery from "../Hooks/Query";
import { ProductItem, WishlistsQuery } from "../types/Products";
import ProductItemCard from "../components/Products/ProductItemCard";
import { useInView } from "react-intersection-observer";
import { WISHLIST_PRODUCTS_TOTAL } from "../Constants";
import useDebounce from "../Hooks/useDebounce";
import EmptySearch from "../components/Products/EmptySearch";
import { GET_WISHLISTS } from "../api/wishlist";

const WishListScreen = () => {
  // State variables
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { inView } = useInView({ threshold: 1.0 });
  const debouncedInView = useDebounce(inView, 300);

  // Fetching data
  const { loading, error, data, refetch } = useGqlQuery<WishlistsQuery>(
    GET_WISHLISTS,
    {
      page: currentPage,
      pageSize: WISHLIST_PRODUCTS_TOTAL,
      orderBy: "create_date desc",
    }
  );

  // Handle data response
  useEffect(() => {
    if (!loading && data) {
      setProducts((prev) =>
        currentPage === 1
          ? data.wishlist.items
          : [...prev, ...(data.wishlist.items ?? [])]
      );
      setHasMore(data.wishlist.pageInfo.hasNextPage);
    }
  }, [data, currentPage, loading]);

  // Infinite scroll trigger
  useEffect(() => {
    if (debouncedInView && hasMore && !loading) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [debouncedInView, hasMore, loading]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Error state
  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <section className="products max-w-7xl mx-auto p-4">
      <h2 className="my-4 mt-20 font-bold text-xl">Хүслийн жагсаалт</h2>
      {!products || products.length === 0 ? (
        <EmptySearch screen={"wishlist"} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {(products ?? []).map((item) => (
            <ProductItemCard
              key={item.id}
              item={item}
              listType={"wishlist"}
              action={() => refetch()}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default WishListScreen;
