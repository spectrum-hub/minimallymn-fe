import { FC, useMemo } from "react";
import { ShoppingCart } from "lucide-react";
import { useLocation } from "react-router";
import { Button, Dropdown, MenuProps } from "antd";
import { scrollToTop } from "../../lib/helpers";
import TotalItemBadge from "../Header/TotalItemBadge";
import { imageBaseUrl } from "../../lib/configs";
import styles from "./header.module.css";
import { HeaderProps } from "../../types/Common";
import { useHistoryNavigate } from "../../Hooks/use-navigate";

const CartButton: FC<HeaderProps> = (props) => {
  const { orderLines, cartItems, cartTotalItems } = props ?? {};
  const { historyNavigate } = useHistoryNavigate();
  const location = useLocation();

  const items: MenuProps["items"] = useMemo(() => {
    if (!orderLines?.length) return [];
    return [
      ...orderLines.map((item) => ({
        key: item.id?.toString() ?? "",
        label: (
          <img
            src={imageBaseUrl(item?.product?.id)}
            alt={item?.lineName}
            className={styles.orderLineImage}
          />
        ),
        icon: (
          <div className="w-full ml-2">
            <p className="text-xs md:text-sm leading-4 line-clamp-2">
              {(item?.product?.name?.length ?? 0) > 20
                ? `${item?.product?.name?.slice(0, 20)}...`
                : item.product?.name ?? ""}
            </p>
            {item.quantity} x{" "}
            {item.priceUnit ? `${item.priceUnit.toLocaleString()}₮` : ""}
          </div>
        ),
      })),
      { key: "divider", type: "divider" },
      {
        key: "button-cart",
        label: (
          <Button block onClick={() => historyNavigate("/checkout/address")}>
            Захиалах{" "}
            <span className="text-xs">
              ( Нийт: <b>{cartItems?.amountTotal?.toLocaleString()}₮ )</b>{" "}
            </span>
          </Button>
        ),
      },
    ];
  }, [cartItems, orderLines, historyNavigate]);

  return (
    <Dropdown
      menu={{ items }}
      placement={"bottomRight"}
      className="cursor-pointer"
      arrow
      open={location.pathname === "/checkout/address" ? false : undefined}
    >
      <button
        className={styles.cartButton}
        onClick={() => {
          
          historyNavigate("/checkout");
          scrollToTop();
        }}
      >
        <ShoppingCart className={styles.showCartIcon + "  border-2 rounded-full p-1 w-8 h-8  "}  />
        <TotalItemBadge totalItem={cartTotalItems} />
        <span className={styles.cartText}>Сагс</span>
      </button>
    </Dropdown>
  );
};

export default CartButton;
