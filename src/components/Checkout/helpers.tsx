import { NotificationType } from "../../context/NotificationCtx";
import { PaymentTypes } from "../../types/Cart";

export const authPayMethods = ["lendmn", "pocketzero", "storepay"];

export const pleaseLoginNotif = {
  body: <div>Та Худалдан авалтаа үргэлжлүүлэхийн тулд та нэвтрэнэ үү</div>,
  title: "Нэвтрэх",
  type: "warning" as NotificationType,
};

export const pleaseLoginNotifWithPayment = (paymentName: string) => {
  return {
    body: (
      <div> Та {paymentName} - ээр худалдан авалт хийхийн тулд нэвтрэнэ үү</div>
    ),
    title: "Нэвтрэх",
    type: "warning" as NotificationType,
    duration: 2,
    
  };
};

export const paymentMethodDescFormat = (paymentMethod: PaymentTypes) => {
  if (paymentMethod === "lendmn") {
    return "Лэндмн";
  }
  if (paymentMethod === "pocketzero") {
    return "Pocketzero";
  }
  if (paymentMethod === "storepay") {
    return "Storepay";
  }
  return "Qpay эсвэл Дансаар";
};
