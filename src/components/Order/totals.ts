import { OrderDetails } from "../../types/Order";

export const orderTotals = (order: OrderDetails) => {

  return {
    title: "Захиалгын мэдээлэл",
    items: [
      {
        label: "Захиалгын дугаар",
        value: "#" + order.id,
      },
      {
        label: "Нийт үнэ",
        value: order.amountTotal?.toLocaleString() + "₮",
        highlight: true,
      },
      {
        label: "Татвар",
        value: order.amountTax?.toLocaleString() + "₮",
      },
      {
        label: "Төлбөрийн төлөв",
        value: order.invoiceStatus === "no" ? "Төлөгдөөгүй" : "Төлөгдсөн",
        status:
          order.invoiceStatus === "no"
            ? "pending"
            : ("success" as "pending" | "success"),
      },
      {
        label: "Үүсгэсэн огноо",
        value: new Date(order.createDate).toLocaleDateString(),
      },
      {
        label: "Хүчинтэй хугацаа",
        value: new Date(order.validityDate).toLocaleDateString(),
      },
    ],
  };
};
