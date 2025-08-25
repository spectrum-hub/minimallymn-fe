import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Spin } from "antd";

import ContentContainer from "../../components/ContentContainer";
import CartItemList from "../../components/cart/CartItemList";
import PaymentInfo from "../../components/Checkout/PaymentInfo";
import EmptyCart from "../../components/cart/Empty";
import { useCart } from "../../Hooks/use-cart";

function CheckoutScreen() {
  const { loading, cart } = useCart();
  const [cartLoading, setCartLoading] = useState<boolean>(loading);

  useEffect(() => {
    setCartLoading(loading);
  }, [loading]);

  const cartItem = cart?.carts?.[0];

  if (
    !cart?.carts ||
    cart?.carts?.[0]?.orderLines?.length === 0 ||
    cart?.carts?.length === 0
  ) {
    return <EmptyCart />;
  }

  return (
    <Spin spinning={loading}>
      <ContentContainer className="py-6">
        <div className="flex justify-between items-center mb-6">
          <ShoppingCart className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
        </div>

        <div className="grid lg:grid-cols-3 gap-2">
          <CartItemList />
          <PaymentInfo
            cartItem={cartItem}
            cartLoading={cartLoading}
            nextPath="/checkout/address"
          />
        </div>
      </ContentContainer>
    </Spin>
  );
}

export default CheckoutScreen;
