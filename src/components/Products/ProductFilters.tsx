// components/Products/ProductFilters.tsx
import React, { useMemo, useState } from "react";
import { Collapse, Checkbox, Badge, Button, Drawer } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { ProductItem } from "../../types/Products";
import { useSearchParams } from "react-router";
import { baseURL } from "../../lib/configs";

interface ProductFiltersProps {
  products: ProductItem[];
  isMobile?: boolean;
  categories?: { id: number; name?: string }[];
}

interface GroupedAttribute {
  id: number;
  name: string;
  values: { id: number; name: string; count: number }[];
}

const FILTER_ATTR_KEY = "filter-attributes";
const FILTER_BRAND_KEY = "brands";

const parseArrayParam = (params: URLSearchParams, key: string) =>
  params.get(key)?.split(",").filter(Boolean) ?? [];

const updateQueryParamArray = (
  params: URLSearchParams,
  key: string,
  value: string,
  add: boolean
) => {
  const list = parseArrayParam(params, key);
  const set = new Set(list);
  if (add) set.add(value);
  else set.delete(value);
  if (set.size) params.set(key, Array.from(set).join(","));
  else params.delete(key);
};

const ProductFilters: React.FC<ProductFiltersProps> = ({
  products,
  isMobile = false,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>(["brands"]);

  const selectedCategory = useMemo(
    () => searchParams.get("category") ?? "",
    [searchParams]
  );

  // Group attributes by attribute_id + counts
  const groupedAttributes = useMemo<GroupedAttribute[]>(() => {
    const map = new Map<number, Map<number, { name: string; count: number }>>();

    for (const p of products || []) {
      for (const a of p.attributes || []) {
        if (!map.has(a.attribute_id)) map.set(a.attribute_id, new Map());
        const vmap = map.get(a.attribute_id)!;
        const existing = vmap.get(a.value_id);
        if (existing) existing.count++;
        else vmap.set(a.value_id, { name: a.value, count: 1 });
      }
    }

    const result: GroupedAttribute[] = [];
    map.forEach((vmap, attrId) => {
      // Take attribute name from first product that has it
      const productWithAttr = products.find((p) =>
        p.attributes.some((x) => x.attribute_id === attrId)
      );
      const attrName =
        productWithAttr?.attributes.find((x) => x.attribute_id === attrId)
          ?.attribute ?? `Атрибут ${attrId}`;
      result.push({
        id: attrId,
        name: attrName,
        values: Array.from(vmap.entries())
          .map(([id, d]) => ({ id, name: d.name, count: d.count }))
          .sort((a, b) => b.count - a.count),
      });
    });

    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const groupedBrands = useMemo(() => {
    const map = new Map<
      number,
      { name: string; count: number; logo?: string }
    >();
    for (const p of products || []) {
      const b = p.brand;
      if (!b?.id) continue;
      const existing = map.get(b.id);
      if (existing) existing.count++;
      else
        map.set(b.id, {
          name: b.name,
          count: 1,
          logo: b.logo?.medium ? baseURL + b.logo.medium : undefined,
        });
    }
    return Array.from(map.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  const selectedAttributes = useMemo(
    () =>
      parseArrayParam(
        new URLSearchParams(searchParams.toString()),
        FILTER_ATTR_KEY
      ),
    [searchParams]
  );
  const selectedBrands = useMemo(
    () =>
      parseArrayParam(
        new URLSearchParams(searchParams.toString()),
        FILTER_BRAND_KEY
      ),
    [searchParams]
  );

  const toggleAttribute = (
    attrId: number,
    valueId: number,
    checked: boolean
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    const key = `${attrId}-${valueId}`;
    updateQueryParamArray(params, FILTER_ATTR_KEY, key, checked);
    setSearchParams(params);
  };

  const toggleBrand = (brandId: number, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    updateQueryParamArray(params, FILTER_BRAND_KEY, String(brandId), checked);
    setSearchParams(params);
  };
  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(FILTER_ATTR_KEY);
    params.delete(FILTER_BRAND_KEY);
    params.delete("category");
    setSearchParams(params);
  };

  const totalFilters =
    selectedAttributes.length +
    selectedBrands.length +
    (selectedCategory ? 1 : 0);

  // Build Collapse items
  const items = [
    {
      key: "brands",
      label: (
        <div className="flex items-center justify-between">
          <span className="font-medium">Брэнд</span>
          {selectedBrands.length > 0 && (
            <Badge
              color={"magenta"}
              size={"small"}
              count={selectedBrands.length}
            />
          )}
        </div>
      ),
      children: (
        <div className="space-y-2 max-h-64 overflow-auto">
          {groupedBrands.map((brand) => (
            <div key={brand.id} className="flex items-center justify-between">
              <Checkbox
                checked={selectedBrands.includes(String(brand.id))}
                onChange={(e) => toggleBrand(brand.id, e.target.checked)}
              >
                <div className="flex items-center gap-2">
                  {brand.logo && (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <span className="text-sm">{brand.name}</span>
                </div>
              </Checkbox>
              <span className="text-xs text-muted-foreground">
                {brand.count}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    ...groupedAttributes.map((attr) => ({
      key: `attr-${attr.id}`,
      label: (
        <div className="flex items-center justify-between">
          <span className="font-medium">{attr.name}</span>
          {selectedAttributes.some((s) => s.startsWith(`${attr.id}-`)) && (
            <Badge
              color={"magenta"}
              size={"small"}
              count={
                selectedAttributes.filter((s) => s.startsWith(`${attr.id}-`))
                  .length
              }
            />
          )}
        </div>
      ),
      children: (
        <div className="space-y-2 max-h-64 overflow-auto">
          {attr.values.map((v) => {
            const key = `${attr.id}-${v.id}`;
            return (
              <div key={v.id} className="flex items-center justify-between">
                <Checkbox
                  checked={selectedAttributes.includes(key)}
                  onChange={(e) =>
                    toggleAttribute(attr.id, v.id, e.target.checked)
                  }
                >
                  <span className="text-xs">{v.name}</span>
                </Checkbox>
                <span className="text-muted-foreground text-xs">{v.count}</span>
              </div>
            );
          })}
        </div>
      ),
    })),
  ];

  const filterContent = (
    <>
      <div
        className="
      flex items-center 
      justify-between mb-3 border border-gray-100
      bg-gray-50 rounded-md p-2"
      >
        <div className="flex items-center gap-2">
          <FilterOutlined
            style={{
              fontSize: "14px",
            }}
          />
          <h3 className="font-semibold text-sm text-gray-600">Шүүлтүүр</h3>
        </div>
      </div>

      <Collapse
        ghost
        activeKey={expandedKeys}
        onChange={(k) => setExpandedKeys((k as string[]) || [])}
        items={items}
        expandIconPosition="end"
      />
    </>
  );

  if (isMobile) {
    return (
      <>
        <Button
          icon={<FilterOutlined />}
          onClick={() => setDrawerOpen(true)}
          className="fixed bottom-6 right-4 z-50"
          type="primary"
          shape="circle"
          size="large"
        >
          {totalFilters > 0 && (
            <Badge color={"magenta"} size={"small"} count={totalFilters} />
          )}
        </Button>

        <Drawer
          title="Шүүлтүүр"
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={320}
        >
          {filterContent}
          <div className="mt-4 flex justify-end gap-2">
            <Button onClick={() => setDrawerOpen(false)}>Хаах</Button>
            <Button type="primary" onClick={() => setDrawerOpen(false)}>
              Харах
            </Button>
          </div>
        </Drawer>
      </>
    );
  }

  return <div className="bg-white rounded p-1 shadow-sm">{filterContent}</div>;
};

export default ProductFilters;
