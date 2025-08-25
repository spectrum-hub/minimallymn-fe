import { FC } from "react";

const LoadingOrder = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
    </div>
  );
};

const OrderNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 ">No order found.</p>
    </div>
  );
};

// error
const ErrorMessage: FC<{
  message?: string;
}> = ({ message }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-50 p-6 rounded-lg shadow-sm">
        <p className="text-red-600 ">Error: {message}</p>
      </div>
    </div>
  );
};

interface InfoCardProps {
  title: string;
  items: Array<{
    label: string;
    value: string;
    highlight?: boolean;
    type?: string
    status?: "pending" | "success";
  }>;
}

const InfoCard: FC<InfoCardProps> = ({ title, items }) => {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden text-xs md:text-sm "
    >
      <h2 className="font-semibold text-sm px-4 border-b p-3">{title}</h2>
      <div className="py-1 px-4 space-y-3">
        {items.map((item, index) => (
          <div key={index} className=" ">
            <span className="text-gray-600 dark:text-gray-400 pr-4 font-light ">
              {item.label}:{" "}
            </span>
            {(() => {
              let statusClass = "";
              if (item.status === "pending") {
                statusClass = "text-yellow-600";
              } else if (item.status === "success") {
                statusClass = "text-green-600";
              }
              return (
                <span
                  className={`  ${
                    item.type === "bank_account"
                      ? " text-purple-600"
                      : "text-black dark:text-white"
                  } ${statusClass}`}
                >
                  {item.value}
                </span>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderStatusBadge: FC<{ status: string }> = ({ status }) => {
  const isPaid = status !== "no";
  return (
    <span
      className={`px-3 py-1 rounded-full   ${
        isPaid
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      }`}
    >
      {isPaid ? "Төлөгдсөн" : "Төлөгдөөгүй"}
    </span>
  );
};

export {
  LoadingOrder,
  OrderNotFound,
  ErrorMessage,
  OrderStatusBadge,
  InfoCard,
};
