import { FC } from "react";
import { GridRow } from "../types";
interface Props {
  row?: GridRow;
  isMobile?: boolean;
}

const RowTextDescription: FC<Props> = ({ row, isMobile }) => {
  // Check if this is a video row
  if (row?.rowType !== "text_description") {
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
        return (
          <div key={item.itemId || index} className="w-full  text-center ">
            {item?.itemDescriptionTitle &&
              item.itemDescriptionTitle.length > 4 && (
                <p>{item.itemDescriptionTitle}</p>
              )}
            {item?.itemDescriptionSubTitle &&
              item.itemDescriptionSubTitle.length > 4 && (
                <p>{item.itemDescriptionSubTitle}</p>
              )}
            {item?.itemDescriptionFullDescription &&
              item.itemDescriptionFullDescription.length > 4 && (
                <p>{item.itemDescriptionFullDescription}</p>
              )}
          </div>
        );
      })}
    </section>
  );
};

export default RowTextDescription;
