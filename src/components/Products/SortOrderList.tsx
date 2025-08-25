// SortOrderList.tsx
import * as React from "react";
import { OrderBy } from "../../types/General";

interface SortOrderListProps {
  sortOrder: OrderBy;
  sortOnChange: (newSortOrder: OrderBy) => void;
  productsLength?: number;
}

interface SortProps {
  label: string;
  value: OrderBy;
}

const sorts: SortProps[] = [
  { label: "Онцолсон", value: "website_sequence asc" },
  { label: "Шинэ нь эхэндээ", value: "create_date desc" },
  { label: "Нэр (А-Я)", value: "name asc" },
  { label: "Үнэ - Багаас их рүү", value: "list_price asc" },
  { label: "Үнэ - Ихээс бага уруу", value: "list_price desc" },
];

const SortOrderList: React.FC<SortOrderListProps> = ({
  sortOrder,
  sortOnChange,
  productsLength,
}) => {
  if (!productsLength || productsLength === 0) {
    return;
  }
  return (
    <select
      className={`
        h-8 md:h-10
       border rounded-md pl-2 pr-4 appearance-none 
        max-w-[200px] text-xs md:text-sm max-h-10 cursor-pointer text-black
      `}
      onChange={(e) => sortOnChange(e.target.value as OrderBy)}
      value={sortOrder}
    >
      {sorts.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
};

export default SortOrderList;
