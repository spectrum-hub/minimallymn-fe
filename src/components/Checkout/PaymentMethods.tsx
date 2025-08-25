import { FC, useContext, useEffect, useMemo } from "react";
import { Cart, PaymentMethods as TPaymentMethod } from "../../types/Cart";
import { baseURL } from "../../lib/configs";
import { Circle, CircleCheckBig } from "lucide-react";

import { pleaseLoginNotifWithPayment } from "./helpers";
import { Context } from "../../context/NotificationCtx";
import { DrawerContext } from "../../context/DrawerContext";
import LoginScreen from "../../Screens/Auth/LoginScreen";

interface Prop {
  cart?: Cart;
  isAuth?: boolean;
  onChangePayment: (arg: string) => void;
  paymentCode?: string;
  errorMessage?: string;
  userPhone?: string
}

const TPaymentMethods: FC<Prop> = ({
  cart,
  onChangePayment,
  paymentCode,
  errorMessage,
  isAuth,
  userPhone,
}) => {
  const { openNotification } = useContext(Context);
  const drawerCtx = useContext(DrawerContext);

  const image = `${baseURL}/web/image/payment.method/`;

  useEffect(() => {
    if (isAuth) {
      drawerCtx.closeDrawer();
    }
  }, [drawerCtx, isAuth]);

  const nPayments = useMemo(() => {
    if (!cart?.paymentMethods) return [];

    return cart.paymentMethods
      .slice()
      .sort((a, b) => {
        return a.sequence - b.sequence;
      })
      .map((payment) => {
        if (payment.code !== "wire_transfer") {
          return {
            ...payment,
            description:
              "Харилцагчийн дугаар: " +
              (userPhone ?? ""),
          };
        }
        return payment;
      });
  }, [cart?.paymentMethods, userPhone]);

  const handleChangePayment = (payment: TPaymentMethod) => {
    if (!isAuth && payment.isAuthRequired) {
      openNotification(pleaseLoginNotifWithPayment(payment.name));
      drawerCtx.showDrawer({
        title: "Нэвтрэх",
        content: <LoginScreen isDrawer={true} />,
        width: "400px",
        placement: "right",
      });
      drawerCtx.setLoading(false);
    } else {
      onChangePayment(payment.code);
    }
  };



  if (!cart?.deliveryCarriers || cart?.deliveryCarriers.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex gap-4 flex-wrap  ${
        errorMessage ? "rounded-xl  border border-red-400 p-2 m-[-10px]" : ""
      }`}
    >
      {(nPayments ?? []).map((payment) => {
        const isChecked = paymentCode === payment.code;
        return (
          <button
            type={"button"}
            key={payment.id}
            onClick={() => handleChangePayment(payment)}
            className={`
              flex items-center justify-between w-full p-4 rounded-xl 
              bg-white shadow-sm 
              hover:shadow-md hover:border-blue-300 
              transition-all duration-200 ease-in-out
              border-2 hover:bg-gray-100
              ${isChecked ? "border-blue-500 bg-blue-50 border-l-8 " : ""}
            `}
          >
            <div className="flex items-center gap-3">
              <img
                alt={payment.name}
                className="w-10 md:w-22 object-contain rounded-xl"
                src={`${image}${payment.id}/image`}
              />
              <div className="flex flex-col text-left">
                <span className="text-gray-700">{payment.name}</span>

                {isAuth && payment?.description && isChecked ? (
                  <span
                    className="
                    text-gray-600 font-semibold font-mono
                     text-xs md:text-sm 
                  "
                  >
                    {payment?.description}
                  </span>
                ) : null}
              </div>
            </div>
            {isChecked ? (
              <CircleCheckBig className="h-6 w-6 text-blue-600" />
            ) : (
              <Circle className="h-6 w-6 text-gray-300" />
            )}
          </button>
        );
      })}
      {errorMessage && (
        <p className="text-red-500 text-xs mt-2 text-center">
          <b>{errorMessage}</b>
        </p>
      )}
    </div>
  );
};

export default TPaymentMethods;
