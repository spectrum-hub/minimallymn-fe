// screens/ProductListScreen.tsx
import React, { FC, useMemo } from "react";
import { X } from "lucide-react";
import styles from "./screens.module.css";
import { useSelector } from "react-redux";
import { Breadcrumb, Button } from "antd";
import { RootState } from "../Redux/store";
import Categories from "../components/Categories";
import { useSearchParams } from "react-router";
import ProductItemCard from "../components/Products/ProductItemCard";
import EmptySearch from "../components/Products/EmptySearch";
import useWindowWidth from "../Hooks/use-window-width";
import BrandBadge from "../components/BrandBadge";
import ProductFilters from "../components/Products/ProductFilters";

const FilterViewButton: FC<{
  attribute: string;
  value: string;
  onClick: () => void;
}> = ({ onClick, value, attribute }) => {
  return (
    <button
      onClick={() => onClick()}
      className="
      flex gap-2 border border-gray-400 py-2 px-3 rounded-2xl
      hover:bg-gray-100 hover:border-gray-300 justify-center
    "
    >
      <span className="font-bold text-xs">{attribute}:</span>
      <span className="text-xs">{value}:</span>
      <X size={14} className="font-bold " />
    </button>
  );
};

const ProductListScreen: React.FC = () => {
  const { isMobile } = useWindowWidth();
  const [searchParams, setSearchParams] = useSearchParams();

  const allProducts = useSelector(
    (state: RootState) => state.products?.data?.items
  );

  const categories = useSelector(
    (state: RootState) => state.category?.data?.categories?.categories
  );

  // query values
  const searchValue = searchParams.get("search") ?? "";
  const selectedCategoryId = Number(searchParams.get("category") ?? 0);
  const filterAttributes = useMemo(
    () =>
      searchParams.get("filter-attributes")?.split(",").filter(Boolean) ?? [],
    [searchParams]
  );
  const existingBrandsFilters = useMemo(
    () => searchParams.get("brands")?.split(",").filter(Boolean) ?? [],
    [searchParams]
  );

  // Filtered products (single source of truth)
  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    let list = allProducts;

    if (searchValue) {
      const q = searchValue.toLowerCase();
      list = list.filter((p) => p.productName.toLowerCase().includes(q));
    }

    if (selectedCategoryId) {
      list = list.filter((p) => p.category?.id === selectedCategoryId);
    }

    if (existingBrandsFilters.length) {
      const set = new Set(existingBrandsFilters.map((s) => String(s)));
      list = list.filter((p) => p.brand?.id && set.has(String(p.brand.id)));
    }

    if (filterAttributes.length) {
      list = list.filter((p) =>
        filterAttributes.every((f) => {
          const [attrId, valId] = f.split("-").map(Number);
          return p.attributes.some(
            (a) => a.attribute_id === attrId && a.value_id === valId
          );
        })
      );
    }

    return list;
  }, [
    allProducts,
    searchValue,
    selectedCategoryId,
    existingBrandsFilters,
    filterAttributes,
  ]);

  // Remove a single filter or param
  const removeFilter = (param: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      const arr = params.get(param)?.split(",").filter(Boolean) ?? [];
      const updated = arr.filter((f) => f !== value);
      if (updated.length) params.set(param, updated.join(","));
      else params.delete(param);
    } else {
      params.delete(param);
    }
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("filter-attributes");
    params.delete("brands");
    params.delete("search");
    params.delete("category");
    setSearchParams(params);
  };

  // Render filter tags minimal
  const renderFilterTags = () => {
    if (!allProducts) return null;
    const hasFilters = Boolean(
      searchValue ||
        filterAttributes.length ||
        existingBrandsFilters.length ||
        selectedCategoryId
    );
    if (!hasFilters) return null;

    return (
      <div className="flex gap-2 flex-wrap items-center">
        {selectedCategoryId > 0 && (
          <FilterViewButton
            attribute="Ангилал"
            value={
              categories?.find((c) => c.id === selectedCategoryId)?.name ||
              `ID ${selectedCategoryId}`
            }
            onClick={() => removeFilter("category")}
          />
        )}
        {searchValue && (
          <Button
            size="small"
            type="default"
            onClick={() => removeFilter("search")}
          >
            <strong className="mr-1">Хайлт:</strong> {searchValue}{" "}
            <X size={14} />
          </Button>
        )}

        {filterAttributes.map((filter) => {
          const [attrId, valueId] = filter.split("-").map(Number);
          const product = allProducts.find((p) =>
            p.attributes.some(
              (a) => a.attribute_id === attrId && a.value_id === valueId
            )
          );
          const attribute = product?.attributes.find(
            (a) => a.attribute_id === attrId && a.value_id === valueId
          );
          if (!attribute) return null;
          return (
            <FilterViewButton
              onClick={() => removeFilter("filter-attributes", filter)}
              attribute={attribute.attribute}
              value={attribute.value}
              key={filter}
            />
          );
        })}

        {existingBrandsFilters.map((brandId) => {
          const brand = allProducts.find(
            (p) => p.brand?.id === Number(brandId)
          )?.brand;
          if (!brand) return null;
          return (
            <FilterViewButton
              key={brandId}
              attribute="Брэнд"
              value={brand.name}
              onClick={() => removeFilter("brands", brandId)}
            />
          );
        })}

        <button onClick={clearAllFilters} className="text-sm text-red-500 ml-2">
          Цэвэрлэх
        </button>
      </div>
    );
  };

  if (!allProducts) return <p>Loading...</p>;

  return (
    <section className="products mx-auto">
      <Categories />

      {/* Mobile filter FAB */}
      {isMobile && (
        <ProductFilters
          products={allProducts}
          isMobile
          categories={categories}
        />
      )}

      <div className="flex gap-4">
        {!isMobile && (
          <aside className="w-72 flex-shrink-0">
            <ProductFilters products={allProducts} categories={categories} />
          </aside>
        )}

        <main className="flex-1 min-w-0">
          <div className={styles.containerItemHeader}>
            <BrandBadge
              brand={filteredProducts[0]?.brand}
              isViewBrand={!existingBrandsFilters[0]}
            />
            <div>
              <h3 className="text-sm text-gray-900 mb-2">Бүтээгдэхүүн</h3>
            </div>
            <div className={styles.containerActions}>
              {searchParams.get("category") && (
                <Breadcrumb className="my-4 w-full" items={[]} />
              )}
              {renderFilterTags()}
            </div>
          </div>

          {filteredProducts.length === 0 ? <EmptySearch /> : null}

          <div className={styles.productsGrid}>
            {filteredProducts.map((item) => (
              <ProductItemCard
                key={item.productId}
                item={item}
                isMobile={isMobile}
              />
            ))}
          </div>
        </main>
      </div>
    </section>
  );
};

export default ProductListScreen;
