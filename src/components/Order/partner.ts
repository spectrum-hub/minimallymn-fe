import { OrderDetails } from "../../types/Order";

export const partnerInfos = (order: OrderDetails) => {
  return {
    title: "Харилцагчийн мэдээлэл",
    items: [
      {
        label: "Нэр",
        value: order.partner.name,
      },
      {
        label: "Утас",
        value: order.partner.phone,
      },
      {
        label: "Хот",
        value: order.partner.city,
      },
      {
        label: "Хаяг",
        value: `${order.partner.street}, ${order.partner.street2}`,
      },
    ],
  };
};
