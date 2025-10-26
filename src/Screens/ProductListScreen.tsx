import { X } from "lucide-react";
import { GET_PRODUCTS } from "../api";
import useGqlQuery from "../Hooks/Query";
import styles from "./screens.module.css";
import { useSelector } from "react-redux";
import { Breadcrumb, Button } from "antd";
import { OrderBy } from "../types/General";
import { RootState } from "../Redux/store";
import useDebounce from "../Hooks/useDebounce";
import Categories from "../components/Categories";
import CircleLoader from "../components/CircleLoader";
import { useInView } from "react-intersection-observer";
import { NavLink, useSearchParams } from "react-router";
import Attributes from "../components/Products/Attributes";
import { useState, useEffect, useMemo } from "react";
import { ProductsQuery, ProductItem } from "../types/Products";
import SortOrderList from "../components/Products/SortOrderList";
import { groupByAttributeId } from "../components/Products/helpers";
import ProductItemCard from "../components/Products/ProductItemCard";
import { PRODUCTS_SCREEN_DEFAULT_TOTAL } from "../Constants";
import EmptySearch from "../components/Products/EmptySearch";
import useWindowWidth from "../Hooks/use-window-width";
import BrandBadge from "../components/BrandBadge";

const ProductListScreen: React.FC = () => {
  const { isMobile } = useWindowWidth();
  const [searchParams, setSearchParams] = useSearchParams();

  const categories = useSelector(
    (state: RootState) => state.category?.data?.categories
  );

  const [sortOrder, setSortOrder] = useState<OrderBy>(
    (searchParams.get("sort") as OrderBy) || "create_date desc"
  );

  // Memoized URL params
  const searchValue = searchParams.get("search") ?? "";

  const selectedCategoryId = searchParams.get("category") ?? "";
  const filterOnSale = searchParams.get("onsale") ?? "";

  const filterAttributes = useMemo(
    () => searchParams.get("filter-attributes")?.split(",") ?? [],
    [searchParams]
  );

  const existingBrandsFilters = useMemo(
    () => searchParams.get("brands")?.split(",") ?? [],
    [searchParams]
  );

  console.log(existingBrandsFilters[0]);
  // State
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [categoryId, setCategoryId] = useState<number | undefined>(
    Number(selectedCategoryId) || undefined
  );

  // Infinite scroll
  const { ref, inView } = useInView({ threshold: 1 });
  const debouncedInView = useDebounce(inView, 300);

  // Fetch products
  const { loading, error, data, refetch } = useGqlQuery<ProductsQuery>(
    GET_PRODUCTS,
    {
      page: currentPage,
      pageSize: PRODUCTS_SCREEN_DEFAULT_TOTAL,
      orderBy: sortOrder,
      ...(searchValue && { searchValue }),
      ...(categoryId && { categoryId }),
      ...(filterOnSale && { onsale: 1 }),
      ...(filterAttributes.length > 0 && {
        attributeValueIds: filterAttributes,
      }),
      ...(existingBrandsFilters.length > 0 && {
        brandIds: existingBrandsFilters.map(Number),
      }),
    },
    {
      context: {
        api: "minimally",
      },
    }
  );

  useEffect(() => {
    setCategoryId(selectedCategoryId ? Number(selectedCategoryId) : undefined);
  }, [selectedCategoryId]);

  useEffect(() => {
    if (!loading && data) {
      setProducts((prev) =>
        currentPage === 1
          ? data.products.items
          : [...prev, ...(data.products.items ?? [])]
      );
      setHasMore(data.products.pageInfo.hasNextPage);
    }
  }, [data, currentPage, loading]);

  useEffect(() => {
    if (debouncedInView && hasMore && !loading) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [debouncedInView, hasMore, loading]);

  useEffect(() => {
    refetch();
  }, [
    searchValue,
    categoryId,
    filterAttributes,
    existingBrandsFilters,
    sortOrder,
    refetch,
  ]);

  // Filter management
  const removeFilter = (param: string, value?: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    if (value) {
      const filters = currentParams.get(param)?.split(",") || [];
      currentParams.set(param, filters.filter((f) => f !== value).join(","));
      if (!currentParams.get(param)) currentParams.delete(param);
    } else {
      currentParams.delete(param);
    }
    setSearchParams(currentParams);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("filter-attributes");
    currentParams.delete("brands");
    currentParams.delete("search");
    setSearchParams(currentParams);
    setCurrentPage(1);
  };

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
  const renderFilterTags = () => {
    const groupedItems = groupByAttributeId(data?.products?.attributes);
    const hasFilters =
      searchValue || filterAttributes.length || existingBrandsFilters.length;

    return (
      <div className="flex gap-2 flex-wrap">
        {searchValue && (
          <Button
            size="small"
            color="pink"
            variant="dashed"
            onClick={() => removeFilter("search")}
            className="flex gap-1"
          >
            <span className="font-bold mr-1">Хайлт:</span>
            <span className="leading-3">{searchValue}</span>
            <X size={16} />
          </Button>
        )}
        {filterAttributes.map((filter) => {
          const [attrId, optionId] = filter.split("-");
          const option = Object.values(groupedItems[attrId]?.items || {}).find(
            (opt) => opt.id === +optionId
          );
          return option ? (
            <Button
              key={filter}
              size="small"
              color="pink"
              variant="dashed"
              onClick={() => removeFilter("filter-attributes", filter)}
              className="flex gap-1"
            >
              <span className="leading-3">{option.name}</span>
              <X size={16} />
            </Button>
          ) : null;
        })}
        {existingBrandsFilters.map((brandId) => {
          const brand = Object.values(groupedItems["brands"]?.items || {}).find(
            (opt) => opt.id === +brandId
          );
          return brand ? (
            <Button
              key={brandId}
              size="small"
              color="pink"
              variant="dashed"
              onClick={() => removeFilter("brands", brandId)}
              className="flex gap-1"
            >
              <span className="leading-3">{brand.name}</span>
              <X size={16} />
            </Button>
          ) : null;
        })}
        {hasFilters ? (
          <button onClick={clearAllFilters} className={styles.clearButton}>
            Цэвэрлэх
          </button>
        ) : null}
      </div>
    );
  };

  if (error) return <p>Error: {error.message}</p>;

  return (
    <section className="products  mx-auto">
      <Categories />
      <div className="flex flex-row gap-4">
        <Attributes attributes={data?.products?.attributes} loading={loading} />
        <div className="w-full">
          <div className={styles.containerItemHeader}>
            <BrandBadge
              brand={products?.[0]?.brand}
              isViewBrand={!existingBrandsFilters?.[0]}
            />

            <div className={styles.containerSubHeader}>
              <h3 className="text-sm text-gray-900 w-full mb-2">
                Бүтээгдэхүүн
              </h3>
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
              {renderFilterTags()}
            </div>
          </div>

          {products.length === 0 ? <EmptySearch /> : null}
          <div className={styles.productsGrid}>
            {(products ?? []).map((item) => (
              <ProductItemCard
                key={item.productId}
                item={item}
                isMobile={isMobile}
              />
            ))}
          </div>

          {hasMore && !loading && <div ref={ref} className="h-10" />}
          <CircleLoader loading={loading} />
        </div>
      </div>
    </section>
  );
};

export default ProductListScreen;
