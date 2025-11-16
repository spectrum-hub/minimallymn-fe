import { useState, useMemo } from "react";
import { Collapse, Checkbox, Badge, Button, Drawer } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { ProductItem } from "../../types/Products";
import { useSearchParams } from "react-router";
import { baseURL } from "../../lib/configs";

interface ProductFiltersProps {
  products: ProductItem[];
  isMobile?: boolean;
}

interface GroupedAttribute {
  id: number;
  name: string;
  values: {
    id: number;
    name: string;
    count: number;
  }[];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ products, isMobile = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedKeys, setExpandedKeys] = useState<string[]>(["attributes", "brands"]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Attribute-уудаас хамгийн их тохиолдсон утгуудыг групп хийх
  const groupedAttributes = useMemo(() => {
    const attrMap = new Map<number, Map<number, { name: string; count: number }>>();

    products.forEach((product) => {
      product.attributes.forEach((attr) => {
        if (!attrMap.has(attr.attribute_id)) {
          attrMap.set(attr.attribute_id, new Map());
        }
        const valueMap = attrMap.get(attr.attribute_id)!;
        const existing = valueMap.get(attr.value_id);
        
        if (existing) {
          existing.count++;
        } else {
          valueMap.set(attr.value_id, { name: attr.value, count: 1 });
        }
      });
    });

    const result: GroupedAttribute[] = [];
    attrMap.forEach((valueMap, attrId) => {
      const firstProduct = products.find((p) => 
        p.attributes.some((a) => a.attribute_id === attrId)
      );
      
      if (firstProduct) {
        const attrName = firstProduct.attributes.find(
          (a) => a.attribute_id === attrId
        )?.attribute || "";

        result.push({
          id: attrId,
          name: attrName,
          values: Array.from(valueMap.entries())
            .map(([id, data]) => ({ id, ...data }))
            .sort((a, b) => b.count - a.count),
        });
      }
    });

    return result;
  }, [products]);

  // Брэндүүдийг групп хийх
  const groupedBrands = useMemo(() => {
    const brandMap = new Map<number, { name: string; count: number; logo?: string }>();

    products.forEach((product) => {
      if (product.brand?.id) {
        const existing = brandMap.get(product.brand.id);
        if (existing) {
          existing.count++;
        } else {
          brandMap.set(product.brand.id, {
            name: product.brand.name,
            count: 1,
            logo: baseURL + product?.brand?.logo?.medium,
          });
        }
      }
    });

    return Array.from(brandMap.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  // Сонгогдсон filter-үүд
  const selectedAttributes = useMemo(
    () => searchParams.get("filter-attributes")?.split(",") || [],
    [searchParams]
  );

  const selectedBrands = useMemo(
    () => searchParams.get("brands")?.split(",").map(Number) || [],
    [searchParams]
  );

  // Attribute filter toggle
  const handleAttributeChange = (attrId: number, valueId: number) => {
    const filterKey = `${attrId}-${valueId}`;
    const currentParams = new URLSearchParams(searchParams.toString());
    const currentFilters = currentParams.get("filter-attributes")?.split(",") || [];

    if (currentFilters.includes(filterKey)) {
      const updated = currentFilters.filter((f) => f !== filterKey);
      if (updated.length > 0) {
        currentParams.set("filter-attributes", updated.join(","));
      } else {
        currentParams.delete("filter-attributes");
      }
    } else {
      currentFilters.push(filterKey);
      currentParams.set("filter-attributes", currentFilters.join(","));
    }

    setSearchParams(currentParams);
  };

  // Brand filter toggle
  const handleBrandChange = (brandId: number) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const currentBrands = currentParams.get("brands")?.split(",").map(Number) || [];

    if (currentBrands.includes(brandId)) {
      const updated = currentBrands.filter((id) => id !== brandId);
      if (updated.length > 0) {
        currentParams.set("brands", updated.join(","));
      } else {
        currentParams.delete("brands");
      }
    } else {
      currentBrands.push(brandId);
      currentParams.set("brands", currentBrands.join(","));
    }

    setSearchParams(currentParams);
  };

  // Бүх filter цэвэрлэх
  const clearAllFilters = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("filter-attributes");
    currentParams.delete("brands");
    setSearchParams(currentParams);
  };

  const totalFilters = selectedAttributes.length + selectedBrands.length;

  const items = [
    {
      key: "brands",
      label: (
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800">Брэнд</span>
          {selectedBrands.length > 0 && (
            <Badge count={selectedBrands.length} color="#1890ff" />
          )}
        </div>
      ),
      children: (
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {groupedBrands.map((brand) => (
            <div
              key={brand.id}
              className="flex items-center justify-between hover:bg-gray-50 p-2 rounded cursor-pointer"
              onClick={() => handleBrandChange(brand.id)}
            >
              <Checkbox
                checked={selectedBrands.includes(brand.id)}
                onChange={() => handleBrandChange(brand.id)}
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
              <Badge count={brand.count} showZero color="#f0f0f0" style={{ color: "#666" }} />
            </div>
          ))}
        </div>
      ),
    },
    ...groupedAttributes.map((attr) => ({
      key: `attr-${attr.id}`,
      label: (
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800">{attr.name}</span>
          {selectedAttributes.some((f) => f.startsWith(`${attr.id}-`)) && (
            <Badge
              count={selectedAttributes.filter((f) => f.startsWith(`${attr.id}-`)).length}
              color="#1890ff"
            />
          )}
        </div>
      ),
      children: (
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {attr.values.map((value) => (
            <div
              key={value.id}
              className="flex items-center justify-between hover:bg-gray-50 p-2 rounded cursor-pointer"
              onClick={() => handleAttributeChange(attr.id, value.id)}
            >
              <Checkbox
                checked={selectedAttributes.includes(`${attr.id}-${value.id}`)}
                onChange={() => handleAttributeChange(attr.id, value.id)}
              >
                <span className="text-sm">{value.name}</span>
              </Checkbox>
              <Badge count={value.count} showZero color="#f0f0f0" style={{ color: "#666" }} />
            </div>
          ))}
        </div>
      ),
    })),
  ];

  const filterContent = (
    <>
      <div className="flex items-center justify-between mb-4 pb-3 border-b">
        <div className="flex items-center gap-2">
          <FilterOutlined className="text-blue-500" />
          <h3 className="font-bold text-lg text-gray-800">Шүүлтүүр</h3>
          {totalFilters > 0 && (
            <Badge count={totalFilters} color="#1890ff" />
          )}
        </div>
        {totalFilters > 0 && (
          <Button
            type="link"
            size="small"
            onClick={clearAllFilters}
            className="text-red-500 hover:text-red-600"
          >
            Цэвэрлэх
          </Button>
        )}
      </div>

      <Collapse
        ghost
        activeKey={expandedKeys}
        onChange={(keys) => setExpandedKeys(keys as string[])}
        items={items}
        expandIconPosition="end"
        className="bg-transparent"
      />
    </>
  );

  if (isMobile) {
    return (
      <>
        <Button
          icon={<FilterOutlined />}
          onClick={() => setDrawerOpen(true)}
          className="fixed bottom-20 right-4 z-50 shadow-lg"
          type="primary"
          size="large"
          shape="circle"
        >
          {totalFilters > 0 && (
            <Badge
              count={totalFilters}
              offset={[-5, 5]}
              className="absolute top-0 right-0"
            />
          )}
        </Button>
        <Drawer
          title="Шүүлтүүр"
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={300}
        >
          {filterContent}
        </Drawer>
      </>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
      {filterContent}
    </div>
  );
};

export default ProductFilters;
