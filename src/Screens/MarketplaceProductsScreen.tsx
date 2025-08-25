/* eslint-disable @typescript-eslint/no-unused-vars */
import useGqlQuery from "../Hooks/Query";
import styles from "./screens.module.css";
import { useSelector } from "react-redux";
import { Breadcrumb, Pagination, Spin } from "antd";
import type { PaginationProps } from "antd";
import { OrderBy } from "../types/General";
import { RootState } from "../Redux/store";
import { NavLink, useSearchParams } from "react-router";
import { useState, useEffect, useMemo } from "react";
import SortOrderList from "../components/Products/SortOrderList";
import { PRODUCTS_SCREEN_AMAZON_TOTAL } from "../Constants";
import EmptySearch from "../components/Products/EmptySearch";
import useWindowWidth from "../Hooks/use-window-width";
import { GET_MARKETPLACE_PRODUCTS } from "../api/marketplace";
import {
  MarketplaceProducts,
  MarketplaceItem,
  MarketplacePageInfo,
} from "../types/Marketplace";
import MarketplaceItemItemCard from "../components/Marketplace/Item";

const MarketplaceProductsScreen: React.FC = () => {
  const { isMobile } = useWindowWidth();
  const [searchParams] = useSearchParams();
  const categories = useSelector(
    (state: RootState) => state.category?.data?.categories
  );
  const [sortOrder, setSortOrder] = useState<OrderBy>(
    (searchParams.get("sort") as OrderBy) || "create_date desc"
  );

  // Memoized URL params
  const searchValue = searchParams.get("search") ?? "";

  const selectedCategoryId = searchParams.get("category") ?? "";

  const filterAttributes = useMemo(
    () => searchParams.get("filter-attributes")?.split(",") ?? [],
    [searchParams]
  );
  const existingBrandsFilters = useMemo(
    () => searchParams.get("brands")?.split(",") ?? [],
    [searchParams]
  );

  // State
  const [products, setProducts] = useState<MarketplaceItem[]>([]);
  const [pageInfo, setPageInfo] = useState<MarketplacePageInfo>();
  const currentPage = 1;

  // Infinite scroll
  // Fetch products
  const { loading, error, data, refetch } = useGqlQuery<MarketplaceProducts>(
    GET_MARKETPLACE_PRODUCTS,
    {
      page: 1,
      pageSize: PRODUCTS_SCREEN_AMAZON_TOTAL,
      searchValue: searchValue,
      // ...(searchValue && { searchText: searchValue }),
      // ...(sortOrder && { orderBy: sortOrder }),
      // ...(categoryId && { categoryId }),
      // ...(filterOnSale && { onsale: 1 }),
      // ...(filterAttributes.length > 0 && {
      //   attributesValues: filterAttributes,
      // }),
      // ...(existingBrandsFilters.length > 0 && {
      //   brands: existingBrandsFilters,
      // }),
    },
    {
      context: {
        api: "commerce",
      },
    }
  );

  useEffect(() => {
    if (!loading && data) {
      setProducts((prev) =>
        currentPage === 1
          ? data?.commerceSearchItems?.items ?? []
          : [...prev, ...(data?.commerceSearchItems?.items ?? [])]
      );
      // setHasMore(!!data?.commerceSearchItems?.pageInfo?.hasNextPage);
    }
  }, [currentPage, data, loading]);

  useEffect(() => {
    if (data?.commerceSearchItems?.pageInfo) {
      setPageInfo(data.commerceSearchItems.pageInfo);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [
    searchValue,
    filterAttributes,
    existingBrandsFilters,
    sortOrder,
    refetch,
  ]);

  // Category breadcrumb

  const getCategoryPath = useMemo(() => {
    if (!selectedCategoryId || !categories?.categories) return [];

    const category = categories.categories.find(
      (cat) => cat.id === +selectedCategoryId
    );
    if (!category?.parentPath) return [];

    const breadcrumbs = category.parentPath
      .split("/")
      .reduce<{ title: React.ReactNode }[]>((acc, id) => {
        const parent = categories?.categories?.find((cat) => cat.id === +id);
        if (parent?.name) {
          acc.push({
            title: (
              <NavLink to={`/products?category=${parent.id}`}>
                <span className="font-medium text-gray-700 text-[14px]">
                  {parent.name}
                </span>
              </NavLink>
            ),
          });
        }
        return acc;
      }, []);

    return [
      {
        title: (
          <NavLink to="/products">
            <span className="font-medium text-gray-700 text-[14px]">
              Бүх ангилалууд
            </span>
          </NavLink>
        ),
      },
      ...breadcrumbs,
    ];
  }, [selectedCategoryId, categories]);

  // Render filter tags

  if (error) return <p>Error: {error.message}</p>;

  if (loading && !products.length)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin />
        <h2>Мэдээлийг татаж байна түр хүлээнэ үү </h2>
      </div>
    );

  if (!products) return <p>Бараа бүтээгдэхүүн олдсонгүй</p>;

  return (
    <section className="products  mx-auto">
      <div className="flex flex-row gap-4">
        <div className="w-full">
          <div className={styles.containerItemHeader}>
            <div className={styles.containerSubHeader}>
              <h2 className="text-md md:text-2xl text-gray-900 w-full mb-2">
                Бараа бүтээгдэхүүн
              </h2>
              <SortOrderList
                sortOrder={sortOrder}
                sortOnChange={setSortOrder}
                productsLength={products.length}
              />
            </div>
            <div className={styles.containerActions}>
              {selectedCategoryId && (
                <Breadcrumb className="my-4 w-full " items={getCategoryPath} />
              )}
            </div>
          </div>

          {!products.length ? <EmptySearch /> : null}
          <div className={styles.productsGrid}>
            {(products ?? []).map((item, index) => (
              <MarketplaceItemItemCard
                key={`${item.id}-${index}`}
                item={item}
                type={"slider"}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="my-8 mx-auto w-full  items-center flex justify-center">
        <Pagination
          total={500}
          itemRender={paginationItemRender}
          showSizeChanger={false}
          current={pageInfo?.currentPage ?? 1}
        />
      </div>
    </section>
  );
};

export default MarketplaceProductsScreen;

const paginationItemRender: PaginationProps["itemRender"] = (
  _,
  type,
  originalElement
) => {
  if (type === "prev") {
    return <NavLink to={"/"}>Өмнөх</NavLink>;
  }
  if (type === "next") {
    return <NavLink to={"/"}>Дараах</NavLink>;
  }
  return originalElement;
};
