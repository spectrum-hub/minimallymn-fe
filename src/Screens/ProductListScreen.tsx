import { X } from "lucide-react";
import styles from "./screens.module.css";
import { useSelector } from "react-redux";
import { Breadcrumb, Button } from "antd";
import { RootState } from "../Redux/store";
import Categories from "../components/Categories";
import { NavLink, useSearchParams } from "react-router";
import { useState, useEffect, useMemo } from "react";
import { ProductItem } from "../types/Products";
import ProductItemCard from "../components/Products/ProductItemCard";
import EmptySearch from "../components/Products/EmptySearch";
import useWindowWidth from "../Hooks/use-window-width";
import BrandBadge from "../components/BrandBadge";
import ProductFilters from "../components/Products/ProductFilters";

const ProductListScreen: React.FC = () => {
  const { isMobile } = useWindowWidth();
  const [searchParams, setSearchParams] = useSearchParams();

  const categories = useSelector(
    (state: RootState) => state.category?.data?.categories
  );

  const allProducts = useSelector(
    (state: RootState) => state.products?.data?.items
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
  const [products, setProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    if (allProducts) {
      setProducts(allProducts);
    }
  }, [allProducts]);

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    
    let filtered = [...allProducts];

    // Filter by search
    if (searchValue) {
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategoryId) {
      filtered = filtered.filter((product) =>
        product.category?.id === Number(selectedCategoryId)
      );
    }

    // Filter by brands
    if (existingBrandsFilters.length > 0) {
      filtered = filtered.filter((product) =>
        product.brand?.id && existingBrandsFilters.includes(String(product.brand.id))
      );
    }

    // Filter by attributes
    if (filterAttributes.length > 0) {
      filtered = filtered.filter((product) => {
        return filterAttributes.every((filter) => {
          const [attrId, valueId] = filter.split("-").map(Number);
          return product.attributes.some(
            (attr) => attr.attribute_id === attrId && attr.value_id === valueId
          );
        });
      });
    }

    return filtered;
  }, [allProducts, searchValue, selectedCategoryId, existingBrandsFilters, filterAttributes]);

  useEffect(() => {
    if (filteredProducts) {
      setProducts(filteredProducts);
    }
  }, [filteredProducts]);

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
  };

  const clearAllFilters = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("filter-attributes");
    currentParams.delete("brands");
    currentParams.delete("search");
    setSearchParams(currentParams);
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
    if (!allProducts) return null;
    
    const hasFilters =
      searchValue || filterAttributes?.length || existingBrandsFilters?.length;

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
          const [attrId, valueId] = filter.split("-").map(Number);
          // Find the attribute value name from any product that has it
          const product = allProducts.find((p) =>
            p.attributes.some(
              (attr) => attr.attribute_id === attrId && attr.value_id === valueId
            )
          );
          const attribute = product?.attributes.find(
            (attr) => attr.attribute_id === attrId && attr.value_id === valueId
          );
          
          return attribute ? (
            <Button
              key={filter}
              size="small"
              color="pink"
              variant="dashed"
              onClick={() => removeFilter("filter-attributes", filter)}
              className="flex gap-1"
            >
              <span className="leading-3">{attribute.value}</span>
              <X size={16} />
            </Button>
          ) : null;
        })}
        {existingBrandsFilters.map((brandId) => {
          const brand = allProducts.find((p) => p.brand?.id === Number(brandId))?.brand;
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

  if (!allProducts) return <p>Error:</p>;

  return (
    <section className="products  mx-auto">
      <Categories />
      
      {/* Mobile Filter Button */}
      {isMobile && allProducts && (
        <ProductFilters products={allProducts} isMobile={true} />
      )}

      <div className="flex flex-row gap-4">
        {/* Filter Sidebar - Зүүн тал - Desktop only */}
        {!isMobile && allProducts && (
          <div className="w-[280px] flex-shrink-0">
            <ProductFilters products={allProducts} />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <div className={styles.containerItemHeader}>
            <BrandBadge
              brand={products?.[0]?.brand}
              isViewBrand={!existingBrandsFilters?.[0]}
            />

            <div className={styles.containerSubHeader}>
              <h3 className="text-sm text-gray-900 w-full mb-2">
                Бүтээгдэхүүн
              </h3>
              {/* <SortOrderList
                sortOrder={sortOrder}
                sortOnChange={setSortOrder}
                productsLength={products.length}
              /> */}
            </div>
            <div className={styles.containerActions}>
              {selectedCategoryId && (
                <Breadcrumb className="my-4 w-full " items={getCategoryPath} />
              )}
              {renderFilterTags()}
            </div>
          </div>

          {(products ?? []).length === 0 ? <EmptySearch /> : null}
          <div className={styles.productsGrid}>
            {(products ?? []).map((item) => (
              <ProductItemCard
                key={item.productId}
                item={item}
                isMobile={isMobile}
              />
            ))}
          </div>

          {/* {hasMore && !loading && <div ref={ref} className="h-10" />}
          <CircleLoader loading={loading} /> */}

          
        </div>
      </div>
    </section>
  );
};

export default ProductListScreen;
