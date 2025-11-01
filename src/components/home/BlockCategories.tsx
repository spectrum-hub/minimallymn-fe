import { FC } from "react";
import { GridRow } from "../../types";
import { baseURL } from "../../lib/configs";

interface Props {
  row?: GridRow;
}

const BlockCategories: FC<Props> = ({ row }) => {
  // "itemViewType": "item_products",

  if (row?.itemViewType === "item_products") {
    const cidIds = (row?.rowItems ?? [])
      .flatMap((item) => item.itemId)
      .join(", ");
    console.log({ cidIds });

    // itemId
    return (
      <section className={` mx-auto `}>
        {(row?.rowItems ?? []).map((item, index) => (
          <div key={index}>
            <img
              key={index}
              src={`${baseURL}${item?.itemImage?.large}`}
              alt={item?.itemTitle || ""}
              className="
              h-14 w-20 object-cover  rounded-md 
            "
            />
            <h2>{item?.itemId}</h2>
            <h2>{item?.itemName}</h2>
          </div>
        ))}
      </section>
    );
  }
  return (
    <section className={` mx-auto `}>
      {(row?.rowItems ?? []).map((item, index) => (
        <div key={index}>
          <img
            key={index}
            src={`${baseURL}${item?.itemImage?.large}`}
            alt={item?.itemTitle || ""}
            className="
              h-14 w-20 object-cover  rounded-md 
            "
          />
          <h2>{item?.itemId}</h2>
          <h2>{item?.itemName}</h2>
        </div>
      ))}
    </section>
  );
};

export default BlockCategories;
