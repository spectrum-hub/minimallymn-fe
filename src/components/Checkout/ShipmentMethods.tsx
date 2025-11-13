import { FC, useEffect, useState } from "react";
import { Cart, DeliveryCarriers } from "../../types/Cart";
import { CheckCircle } from "lucide-react"; // Replacing Ant Design icon with Lucide for consistency
import { formatPriceWithSign } from "../../lib/helpers";

interface ShipmentMethodsProps {
  cart?: Cart;
  onChange: (arg: DeliveryCarriers) => void;
  message?: string;
}

const ShipmentMethods: FC<ShipmentMethodsProps> = ({
  onChange,
  cart,
  message,
}) => {
  const [selectedDeliveryMethodId, setSelectedDeliveryMethodId] = useState(
    cart?.selectedDeliveryMethod
  );
  useEffect(() => {
    if (cart?.deliveryCarriers?.length === 1) {
      onChange(cart.deliveryCarriers[0]);
    }
  }, [cart, onChange]);


  useEffect(() => {
    setSelectedDeliveryMethodId(cart?.selectedDeliveryMethod);
    console.log(cart);
  }, [cart]);

  if (!cart?.deliveryCarriers || cart.deliveryCarriers.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-4 mx-auto">
      {cart?.deliveryCarriers?.map((delivery) => (
        <ShipmentButton
          key={delivery.id}
          shipping={delivery}
          isSelected={
            selectedDeliveryMethodId === delivery?.id ||
            cart?.deliveryCarriers?.length === 1
          }
          onClick={() => onChange(delivery)}
        />
      ))}
      {message && (
        <p className="text-red-500 text-sm mt-2 text-center">{message}</p>
      )}
    </div>
  );
};

interface ShipmentButtonProps {
  shipping: DeliveryCarriers;
  isSelected: boolean;
  onClick: () => void;
}

const ShipmentButton: FC<ShipmentButtonProps> = ({
  shipping,
  isSelected,
  onClick,
}) => {
  const rate =
    Number(shipping.fixedPrice) === 0
      ? "Free Shipping"
      : formatPriceWithSign(shipping.fixedPrice);

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-between w-full p-4 rounded
        bg-white border border-gray-200 shadow-sm
        hover:shadow-md hover:border-gray-500 
        transition-all duration-200 ease-in-out
        ${isSelected ? "border-black bg-blue-50 shadow-md" : ""}
      `}
      type={"button"}
    >
      {/* Left: Name and Price */}
      <div className="flex gap-2">
        <span className="text-gray-700 ">{shipping.name}</span>
        <span className="text-gray-900 ">{rate}</span>
      </div>

      {/* Right: Check Icon */}
      {isSelected && <CheckCircle className="h-6 w-6 text-black" />}
    </button>
  );
};

export default ShipmentMethods;
