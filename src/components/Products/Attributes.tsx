import { Checkbox } from "antd";
import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Attribute, groupByAttributeId } from "./helpers";
import "./Attributes.css"; // Add a separate CSS file for animations

interface AttributesProps {
  attributes?: Attribute[];
  loading?: boolean;
}

const Attributes: React.FC<AttributesProps> = ({ attributes, loading }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [displayedAttributes, setDisplayedAttributes] = useState<
    Attribute[] | undefined
  >(attributes);

  // Sync displayedAttributes with incoming attributes, but keep old data during loading
  useEffect(() => {
    if (!loading) {
      setDisplayedAttributes(attributes);
    }
  }, [attributes, loading]);

  // Memoized filter values from URL
  const existingFilters = useMemo(
    () => searchParams.get("filter-attributes")?.split(",") ?? [],
    [searchParams]
  );
  const existingBrandsFilters = useMemo(
    () => searchParams.get("brands")?.split(",") ?? [],
    [searchParams]
  );

  // Grouped attributes
  const groupedItems = useMemo(
    () =>
      groupByAttributeId(
        displayedAttributes?.filter((f) => f.displayType !== "brand")
      ),
    [displayedAttributes]
  );
  const groupedBrandItems = useMemo(
    () =>
      groupByAttributeId(
        displayedAttributes?.filter((f) => f.displayType === "brand")
      ),
    [displayedAttributes]
  );

  // Generic filter toggle function
  const toggleFilter = (
    key: string,
    filterType: "filter-attributes" | "brands",
    currentFilters: string[]
  ) => {
    const updatedFilters = currentFilters.includes(key)
      ? currentFilters.filter((f) => f !== key)
      : [...currentFilters, key];

    if (updatedFilters.length > 0) {
      searchParams.set(filterType, updatedFilters.join(","));
    } else {
      searchParams.delete(filterType);
    }
    setSearchParams(searchParams);
  };

  // Render checkbox group with transition
  const renderCheckboxGroup = (
    items: Record<number, Attribute>,
    filterType: "filter-attributes" | "brands",
    getFilterKey: (option: Attribute) => string,
    currentFilters: string[]
  ) => {
    const options = Object.values(items);
    return (
      <div className="flex flex-col gap-1 attributes-transition">
        {options.map((option) => (
          <Checkbox
            key={option.id}
            checked={currentFilters.includes(getFilterKey(option))}
            onChange={() =>
              toggleFilter(getFilterKey(option), filterType, currentFilters)
            }
          >
            <span className="text-gray-600">{option.name}</span>
          </Checkbox>
        ))}
      </div>
    );
  };

  // Render attribute/brand section
  const renderSection = (
    groupedData: Record<
      string,
      { name: string; items: Record<number, Attribute> }
    >,
    filterType: "filter-attributes" | "brands",
    getFilterKey: (option: Attribute) => string,
    currentFilters: string[]
  ) => (
    <>
      {Object.entries(groupedData).map(([attributeId, { name, items }]) => (
        <div key={attributeId} className="attributes-section">
          <h2 className="my-2 font-bold text-sm">{name}:</h2>
          {renderCheckboxGroup(items, filterType, getFilterKey, currentFilters)}
        </div>
      ))}
    </>
  );

  // Loading skeleton
  const renderLoadingSkeleton = () => (
    <div className="min-w-60 my-4 hidden md:block">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="h-12 w-full bg-gray-200 rounded animate-pulse mb-2"
        />
      ))}
    </div>
  );

  return (
    <div className="min-w-60 bg-white my-4 rounded-md hidden md:block px-2 pl-3 attributes-container">
      {loading && !displayedAttributes ? (
        renderLoadingSkeleton()
      ) : (
        <>
          {renderSection(
            groupedBrandItems,
            "brands",
            (option) => `${option.id}`,
            existingBrandsFilters
          )}
          {renderSection(
            groupedItems,
            "filter-attributes",
            (option) => `${option.attributeId?.[0]}-${option.id}`,
            existingFilters
          )}
        </>
      )}
    </div>
  );
};

export default Attributes;
