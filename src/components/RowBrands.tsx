import { FC } from "react";
import { GridRow } from "../types";
interface Props {
  row?: GridRow;
  isMobile?: boolean;
}

const RowBrands: FC<Props> = ({ row, isMobile }) => {
  if (row?.rowType !== "brand") {
    return null;
  }

  const items = row?.rowItems || [];

  if (items.length === 0) {
    return null;
  }

  // Multiple videos - show in swiper
  return (
    <section className={`mx-auto my-8  --${isMobile}`}>
      {/* Section Title */}
      {row?.sectionTitle && (
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {row.sectionTitle}
          </h2>
          {row?.sectionSubtitle && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              {row.sectionSubtitle}
            </p>
          )}
          {row?.sectionDescription && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {row.sectionDescription}
            </p>
          )}
        </div>
      )}

      {(items ?? []).map((item, index) => {
        // "itemDescriptionViewStyle": "text_only",
        const { itemId, itemName } = item ?? {};
        return (
          <div key={item.itemId || index} className="w-full  text-center ">
             {itemName && <img src={itemName} alt={itemName} />}
          </div>
        );
      })}
    </section>
  );
};

export default RowBrands;
