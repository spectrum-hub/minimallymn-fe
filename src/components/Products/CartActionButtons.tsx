import { Button } from "antd";
import { FC, useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { CartCreateUpdate } from "../../api/cart";
import { websiteId } from "../../lib/configs";
import { Context } from "../../context/NotificationCtx";
import { useCart } from "../../Hooks/use-cart";
import { scrollToTop } from "../../lib/helpers";
import { useHistoryNavigate } from "../../Hooks/use-navigate";

interface Props {
  initialAmount?: number;
  productId?: number;
  quantity?: number;
  productName?: string;
  setIsErrorAttribute: (arg: boolean) => void;
  isVariant?: number;
  isMobile?: boolean;
}

const CartActionButtons: FC<Props> = ({
  initialAmount,
  productId,
  quantity = 1,
  productName,
  setIsErrorAttribute,
  isVariant,
  isMobile,
}) => {
  const { openNotification } = useContext(Context);

  const { historyNavigate } = useHistoryNavigate();
  const { refetchCart } = useCart();
  const [isMessage, setIsMessage] = useState(false);

  const [executeCreateOrder, { loading }] = useMutation(CartCreateUpdate);

  const isErrorAttribute = () => {
    if (!productId) {
      scrollToTop();
      setIsMessage(true);
      setIsErrorAttribute(true);
      return null;
    } else {
      setIsMessage(false);
    }
  };

  const handleBuy = async () => {
    isErrorAttribute();
    if (productId) {
      await handleUpdateCart().then(() => historyNavigate("/checkout/address"));
    }
  };
  const handleUpdateCart = async () => {
    isErrorAttribute();
    try {
      const response = await executeCreateOrder({
        variables: {
          partnerId: Number(websiteId),
          orderLine: {
            productId: Number(productId),
            quantity,
            isVariant,
          },
        },
      });
      if (response.data?.createOrder?.order?.existCart) {
        refetchCart();

        openNotification({
          body: (
            <div>
              Таны сагсанд <b>{quantity}</b> ширхэг <b>{productName} </b>{" "}
              нэмэгдлээ
            </div>
          ),
          title: "Сагс",
          type: "success",
        });
      }

    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  return (
    <div
      className={`w-full ${isMobile ? "" : "max-w-[442px]"} `}
    >
      {isMessage && !productId && (
        <p className="text-red-500 text-sm my-2">
          Худалдан авахын тулд эхлээд сонголтоо хийнэ үү
        </p>
      )}

      {Number?.(initialAmount) > 0 ? (
        <div className="flex gap-4 my-4">
          <Button
            block
            type={"default"}
            color={"primary"}
            variant={"outlined"}
            size={"large"}
            onClick={handleUpdateCart}
            disabled={loading}
          >
            Сагсанд нэмэх
          </Button>
          <Button
            block
            type={"primary"}
            variant={"outlined"}
            size={"large"}
            onClick={handleBuy}
            disabled={loading}
          >
            Худалдан авах
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default CartActionButtons;
