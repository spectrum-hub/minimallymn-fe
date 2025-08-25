import { OrderLine } from "../../types/Cart";
import { UPDATE_CART_ITEM } from "../../api/cart";
import { useMutation } from "@apollo/client";
import { imageBaseUrl } from "../../lib/configs";
import { Minus, Plus, Trash as X } from "lucide-react";
import { NavLink } from "react-router";
import { FC, useState } from "react";
import styles from "./cart.module.css";
import { Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { getCartAsync } from "../../Redux/cartActions";

const productLink = (item?: OrderLine) => {
  if (!item?.product?.productTmplId) return "/products"; // Handle missing product ID

  const baseUrl = `/products/${item.product.productTmplId}`;

  return item.product.combinationIndices
    ? `${baseUrl}?attribute=${encodeURIComponent(
        item.product.combinationIndices
      )}`
    : baseUrl;
};

interface Props {
  screen?: "cart" | "address";
}

function CartItems({ screen = "cart" }: Readonly<Props>) {
  const dispatch: AppDispatch = useDispatch();
  const { cart } = useSelector((state: RootState) => state.cart);
  const [executeUpdateCartItem] = useMutation(UPDATE_CART_ITEM);
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});

  const updateQuantity = async (item: OrderLine, value: number) => {
    try {
      const availableQty = item?.product?.qtyAvailable ?? 0;
      const newQty = (item.quantity ?? 0) + value;

      if (value > 0 && newQty > availableQty) return;

      setLoadingItems((prev) => ({ ...prev, [String(item.id)]: true }));
      await executeUpdateCartItem({
        variables: {
          lineId: item.id,
          productId: item.product?.id ?? "",
          addQty: value,
          setQty: newQty,
        },
      });

      dispatch(getCartAsync());
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setLoadingItems((prev) => ({ ...prev, [String(item.id)]: false }));
    }
  };

  const removeItem = async (item: OrderLine) => {
    if (item?.quantity) await updateQuantity(item, -item.quantity);
  };

  const isCartScreen = screen === "cart";

  return (cart?.carts ?? []).map((cart, index) => (
    <div
      key={index}
      className={`lg:col-span-2 space-y-${
        screen === "cart" ? "4" : "2"
      } w-full`}
    >
      {cart?.orderLines?.map((item) => (
        <Spin key={item.id} spinning={loadingItems[String(item.id)] ?? false}>
          <div className={styles.cart_item_container}>
            <img
              src={imageBaseUrl(item?.product?.id)}
              alt={item?.lineName}
              className={
                (styles.cart_image,
                isCartScreen
                  ? "w-16 h-16 md:w-24 md:h-24"
                  : "w-10 h-10 md:w-10 md:h-10")
              }
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <NavLink
                  to={productLink(item)}
                  className={`${
                    isCartScreen ? "md:text-[16px]" : "md:text-[12px]"
                  } ${styles.cartItemLink}`}
                >
                  <p>{item?.lineName}</p>
                  <p>
                    {item.priceSubtotal
                      ? `${item.priceSubtotal.toLocaleString()}₮`
                      : null}
                  </p>
                </NavLink>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item);
                  }}
                  className={styles.cartItemRemove}
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
              {isCartScreen ? (
                <QuantityChanger updateQuantity={updateQuantity} item={item} />
              ) : null}
            </div>
          </div>
        </Spin>
      ))}
    </div>
  ));
}

export default CartItems;

const QuantityChanger: FC<{
  updateQuantity: (item: OrderLine, arg: number) => void;
  item: OrderLine;
}> = ({ updateQuantity, item }) => (
  <div className="flex items-center gap-1 mt-4">
    <MButton onClick={() => updateQuantity(item, -1)} type={"minus"} />
    <span className={styles.cartQuantity}>{item.quantity}</span>
    <MButton onClick={() => updateQuantity(item, 1)} type={"plus"} />
  </div>
);

const MButton: FC<{ onClick: () => void; type: "plus" | "minus" }> = ({
  onClick,
  type,
}) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={styles.cart_update_btn}
    >
      {type === "plus" && (
        <Plus className="w-4 h-4 dark:text-white" strokeWidth={1.5} />
      )}

      {type === "minus" && (
        <Minus className="w-4 h-4 dark:text-white" strokeWidth={1.5} />
      )}
    </button>
  );
};
