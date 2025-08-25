import { FC } from "react";
import { OrderDetails } from "../../types/Order";
import { imageBaseUrl } from "../../lib/configs";

interface Props {
  order?: OrderDetails;
}

const OrderLinesItems: FC<Props> = ({ order }) => {
  return (
    <div
      className="
          bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6
        "
    >
      <h2 className=" text-sm px-4 border-b p-3">Захиалсан бараанууд</h2>
      <div className="divide-y dark:divide-gray-700">
        {order?.orderLines?.map((item) => (
          <div key={item.id} className="p-4 flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <img
                src={
                  item.name === "Standard delivery" || item.name === "Хүргэлт"
                    ? "/images/delivery.png"
                    : imageBaseUrl(item?.productId)
                }
                alt={item?.name}
                className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-lg shadow"
              />
              <span
                className="absolute -top-2 -right-2 border 
                   text-[11px] font-bold rounded-full bg-blue-700 text-white
                    w-6 h-6 flex items-center justify-center"
              >
                {item.qtyAvailable}
              </span>
            </div>
            <div className="flex-grow min-w-0">
              <h3 className=" text-gray-900 dark:text-white truncate">
                {item.name === "Standard delivery" ? "Хүргэлт" : item.name}
              </h3>
              <p className="mt-1">{item.price?.toLocaleString()}₮</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderLinesItems;
