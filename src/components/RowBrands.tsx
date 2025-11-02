import { FC } from "react";
import { GridRow } from "../types";
import { baseURL } from "../lib/configs";
import { NavLink } from "react-router";
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

      <div className="flex flex-wrap justify-items-center justify-center items-center gap-4 w-full">
        {(items ?? []).map((item, index) => {
          // "itemDescriptionViewStyle": "text_only",
          const { itemId, itemImage, itemName } = item ?? {};
          return (
            <div
              key={itemId || index}
              className=" 
            hover:shadow-md
            text-center border-2 rounded-lg p-2"
            >
              {(itemImage?.medium ?? "").length > 2 && (
                <NavLink
                  to={`/products?brands=${itemId}`}
                  key={itemId}
                  className={`
                    w-28   text-center
                `}
                >
                  <img
                    src={`${baseURL}${itemImage.medium}`}
                    alt={itemName ?? ""}
                    className="
                    w-20 md:w-28 object-contain h-20 rounded-md  
                    hover:scale-105 transition-transform duration-200
                    "
                  />
                  <span className="text-sm md:text-xs">{itemName}</span>
                </NavLink>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RowBrands;
