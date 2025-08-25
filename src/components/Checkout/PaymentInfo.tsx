import { Spin } from "antd";
import { Truck } from "lucide-react";
import { Cart } from "../../types/Cart";
import { useHistoryNavigate } from "../../Hooks/use-navigate";

interface PaymentInfoItemProps {
  label?: string;
  value?: string | number;
  className?: string;
}

const PaymentInfoItem = ({ label, value, className }: PaymentInfoItemProps) => {
  return (
    <div className={`flex justify-between items-center ${className}`}>
      <span className="text-gray-600 dark:text-gray-300">{label}</span>
      <span className="font-medium dark:text-white">{value}</span>
    </div>
  );
};

interface PaymentInfoProps {
  cartItem?: Cart | object;
  cartLoading: boolean;
  showNextButton?: boolean;
  nextPath?: string;
}

const PaymentInfo = ({
  cartItem,
  cartLoading,
  nextPath,
  showNextButton = true,
}: PaymentInfoProps) => {
    const { historyNavigate } = useHistoryNavigate();
    
  const cartTotalItems = (cartItem as Cart)?.orderLines?.reduce(
    (acc, item) => acc + (item.quantity ?? 0),
    0
  );

  const deliveryList = () => {
    const deliveries: {
      label: string | undefined;
      value: string | undefined;
    }[] = [];

    (cartItem as Cart)?.selectedDeliveriers?.forEach?.((delivery) => {
      deliveries.push({
        label: delivery.product?.name,
        value: `${delivery?.priceTotal?.toLocaleString()}₮`,
      });
    });
    return deliveries;
  };

  const items = [
    {
      label: "Захиалгын дугаар",
      value: `#${(cartItem as Cart)?.name}`,
    },
    {
      label: "Барааны тоо",
      value: cartTotalItems ?? 0,
    },
    {
      label: "Барааны нийт үнэ",
      value: `${(cartItem as Cart)?.amountTotal?.toLocaleString() ?? "0"}₮`,
    },
    {
      label: "НӨАТ",
      value: "0₮",
    },
    ...deliveryList()
  ];

  return (
    <div
      className={`
      bg-white dark:bg-gray-800 rounded shadow-lg 
        dark:shadow-gray-800/20 p-8 h-fit `}
    >
      <h2 className="font-bold mb-2 border-b ">
        Төлбөрийн мэдээлэл
      </h2>

      <div className="space-y-4">
        {items.map((item, index) => (
          <PaymentInfoItem key={index} {...item} />
        ))}

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
          <PaymentInfoItem
            label="Нийт"
            value={`${(
              (cartItem as Cart)?.amountTotal ?? 0
            ).toLocaleString()}₮`}
            className="font-bold"
          />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          <Truck className="w-5 h-5" strokeWidth={1.5} />
          <span>Хүргэлт 24 цагийн дотор хүргэгдэнэ</span>
        </div>

        {showNextButton ? (
          <Spin spinning={cartLoading}>
            {nextPath ? (
              <button
                className={`
              w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white
              py-3 px-6 rounded-xl font-semibold hover:opacity-90 
              transition-opacity shadow-lg shadow-purple-500/25 
              hover:shadow-xl hover:shadow-purple-500/30
            `}
                onClick={() => historyNavigate(nextPath)}
              >
                Худалдан авах
              </button>
            ) : null}
          </Spin>
        ) : null}
      </div>
    </div>
  );
};

export default PaymentInfo;
