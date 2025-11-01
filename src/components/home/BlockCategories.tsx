import { FC } from "react";
import { RowItem } from "../../types";
import { baseURL } from "../../lib/configs";

interface Props {
  rowItems?: RowItem[];
}

const BlockCategories: FC<Props> = ({ rowItems }) => {
  return (
    <section className={` mx-auto `}>
      {(rowItems ?? []).map((item, index) => (
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
