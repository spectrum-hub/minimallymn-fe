/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation } from "@apollo/client";
import { Form, Button, Input } from "antd";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider, Controller } from "react-hook-form";

import EmptyCart from "../../components/cart/Empty";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import CartItemList from "../../components/cart/CartItemList";
import PaymentInfo from "../../components/Checkout/PaymentInfo";
import { validSchema2 } from "../../lib/form-schemas";
import CustomerTypeComp from "../../components/Checkout/CustomerType";
import PaymentMethods from "../../components/Checkout/PaymentMethods";
import ShipmentMethods from "../../components/Checkout/ShipmentMethods";
import { CustomerType, StepValues } from "../../types/Common";
import { CREATE_ORDER_CHECKOUT, setDeliveryMethodGQL } from "../../api/cart";

import { getCartAsync } from "../../Redux/cartActions";
import { useCart } from "../../Hooks/use-cart";
import { Context } from "../../context/NotificationCtx";
import ErrorMessege from "../../components/Checkout/ErrorMessege";
import { useHistoryNavigate } from "../../Hooks/use-navigate";
import CheckoutWarnings from "../../components/Checkout/CheckoutWarningMessages";
import AddressList from "../../components/User/AddressList";

const CheckoutScreen: React.FC = () => {
  const { openNotification } = useContext(Context);
  const { historyNavigate } = useHistoryNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);
  const userInfo = useSelector((state: RootState) => state.userInfo);

  const checkoutWarningMessages = useSelector(
    (state: RootState) =>
      state.layouts.data?.themeGrid?.checkoutWarningMessages || []
  );
  const { cart, loading } = useSelector((state: RootState) => state.cart);

  const { refetchCart } = useCart();

  const { isAuthenticated } = authState ?? {};
  const userData = userInfo?.data?.userProfile;
  const userPartnerData = userInfo?.data?.userProfile;

  const isAuth = isAuthenticated;

  const [paymentMessage, setPaymentMessage] = useState<string>("");

  const [cartLoading, setCartLoading] = useState(loading);

  const [selectedAddressText, setSelectedAddressText] = useState<string>();

  useEffect(() => {
    if (!authState?.isAuthenticated) {
      historyNavigate(
        "/auth/login?notification=Худалдан авалтаа үргэлжлүүлхийн тулд нэвтэрнэ үү"
      );
    }
  }, [authState?.isAuthenticated, historyNavigate]);

  const [selectedPaymentCode, setSelectedPaymentCode] =
    useState<string>("wire_transfer");
  const [userPhoneNumber, setUserPhoneNumber] = useState<string>();

  const [deliveryId, setDeliveryId] = useState<number>();
  const [isDeliverySet, setIsDeliverySet] = useState<boolean>(false);
  const [customerType, setCustomerType] = useState<CustomerType>("citizen");
  const [orderCreateStatus, setOrderCreateStatus] = useState<
    "pending" | "failed" | "success"
  >("pending");

  const [checkoutWarningMessagesState, setCheckoutWarningMessagesState] =
    useState<Record<number, string> | undefined>();

  const handleToggleWarning = (id: number, text: string) => {
    setCheckoutWarningMessagesState((prev) => {
      if (!prev) {
        return { [id]: text };
      }
      if (prev[id]) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: text };
    });
  };

  const handleRemoveWarning = (id: number) => {
    setCheckoutWarningMessagesState((prev) => {
      if (!prev) return prev;
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const formMethods = useForm<StepValues>({
    resolver: yupResolver(validSchema2),
    defaultValues: {
      firstname: userData?.fullname,
      s_phone: userData?.phone,
      email: userPartnerData?.email,
      paymentCode: "wire_transfer",
      deliveryId: undefined,
    },
  });

  const { control, setValue, reset, handleSubmit, getValues } = formMethods;

  const cartItem = cart?.carts?.[0];

  const [executeCreateOrder] = useMutation(CREATE_ORDER_CHECKOUT);
  const [executeSetDeliveryMethod] = useMutation(setDeliveryMethodGQL);

  const setDeliveryMethodFunc = useCallback(
    async (deliveryId: number) => {
      try {
        const result = await executeSetDeliveryMethod({
          variables: { carrierId: deliveryId },
        });

        if (result.data?.isSuccess) {
          setIsDeliverySet(true);
          return true;
        }
      } catch (error) {
        console.error("Delivery method setting failed", error);
      }
      return false;
    },
    [executeSetDeliveryMethod]
  );

  useEffect(() => {
    if (cartItem?.isDeliverySelected || cartItem?.orderLines?.length === 0) {
      return;
    }
    const deliveries = cartItem?.deliveryCarriers;
    if (deliveries?.length === 1) {
      const deliveryId = deliveries?.[0]?.id;
      if (deliveryId) {
        setCartLoading(true);
        setValue("deliveryId", deliveryId);
        setDeliveryId(deliveryId);
        setDeliveryMethodFunc(deliveryId);
        refetchCart();
        setCartLoading(false);
      }
    }
  }, [cartItem, isDeliverySet, refetchCart, setDeliveryMethodFunc, setValue]);

  useEffect(() => {
    if (userData?.fullname) {
      reset({
        firstname:
          userData?.fullname === userData?.phone ? "" : userData?.fullname,
        s_phone: userData?.phone,
        email: userPartnerData?.email,
      });
      setUserPhoneNumber(userData?.phone);
    }
  }, [userData, reset, userPartnerData, isAuth]);

  useEffect(() => {
    setCartLoading(loading);
  }, [loading]);

  const onSubmit = async (data: StepValues) => {
    try {
      const { s_address, s_phone, firstname, email } = data;

      setCartLoading(true);

      const checkoutWarningMessages =
        Object.values(checkoutWarningMessagesState ?? {}).join(",  ") ||
        undefined;
      const result = await executeCreateOrder({
        variables: {
          address: selectedAddressText,
          phone: s_phone,
          name: firstname,
          email,
          note: s_address,
          paymentMethod: selectedPaymentCode,
          deliveryMethod: deliveryId,
          checkoutWarningMessages: checkoutWarningMessages,
        },
      });
      const orderResult = result?.data?.checkoutOrder;
      if (orderResult?.isSuccess) {
        setOrderCreateStatus("success");
        await dispatch(getCartAsync());
        historyNavigate(`/orders/${orderResult.values?.order_id}`);
        setPaymentMessage("");
        setCartLoading(false);
      } else {
        openNotification({
          type: "error",
          body: <div>Захиалга амжилтгүй боллоо</div>,
        });

        const paymentResult = orderResult?.values;

        if (
          selectedPaymentCode === "storepay" &&
          paymentResult.status === "Failed"
        ) {
          setOrderCreateStatus("failed");
          const msg =
            paymentResult?.payment_response?.msgList?.[0]?.text ??
            "Storepay амжилтгүй боллоо";
          const m = `${userPhoneNumber} - дугаартай ${msg}`;
          setPaymentMessage(m);
          setCartLoading(false);
        }

        setCartLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setOrderCreateStatus("failed");
      setCartLoading(false);
    }
  };

  const renderInput = (name: keyof StepValues, label: string) => (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <Form.Item
            label={label}
            validateStatus={fieldState.error ? "error" : ""}
            help={fieldState.error?.message}
            layout="vertical"
          >
            <Input
              {...field}
              onChange={(v) => {
                field.onChange(v);
                if (name === "s_phone") {
                  setUserPhoneNumber(v.target.value);
                }
              }}
              value={String(field.value) === "false" ? "" : field?.value ?? ""}
              className="w-full max-w-64"
              size={"large"}
            />
          </Form.Item>
        );
      }}
    />
  );

  if (!cartItem?.orderLines?.length) {
    return <EmptyCart />;
  }

  return (
    <div className="form-payment-delivery-address py-2 bg-gradient-to-b from-gray-50 to-white px-0">
      <div className="grid lg:grid-cols-3 gap-4  mx-auto">
        <div className="lg:col-span-2">
          <FormProvider {...formMethods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white shadow-lg rounded-xl p-4 max-w-[700px] "
            >
              <h2 className="text-sm md:text-md py-2 border-b border-gray-300">
                Төлбөр, Хүргэлтийн мэдээлэл
              </h2>
              <div className="mb-4">
                <Controller
                  control={control}
                  name="customer_type"
                  defaultValue="citizen"
                  render={({ field }) => (
                    <CustomerTypeComp
                      onChange={(value) => {
                        field.onChange(value);
                        setCustomerType(value);
                      }}
                      customer={customerType}
                    />
                  )}
                />
                {customerType === "organization" && (
                  <div className="bg-gray-50 max-w-52">
                    {renderInput("register_org", "Байгууллагын регистер")}
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {renderInput("firstname", "Нэр")}
                  {renderInput("s_phone", "Холбогдох утас")}
                  {renderInput("email", "И-мэйл хаяг")}
                </div>

                <AddressList
                  isCheckout={true}
                  setSelectedAddress={setSelectedAddressText}
                />
              </div>

              <div className="space-y-4">
                <h2 className="font-bold text-md">Хүргэлтийн төлбөр</h2>
                <Controller
                  control={control}
                  name="deliveryId"
                  render={(props) => (
                    <ShipmentMethods cart={cart?.carts?.[0]} {...props} />
                  )}
                />
                <h2 className="font-bold text-md">Төлбөрийн сонголт</h2>

                {selectedPaymentCode === "storepay" && (
                  <ErrorMessege
                    message={paymentMessage}
                    messageBold={getValues("paymentCode")}
                  />
                )}

                <Controller
                  control={control}
                  name="paymentCode"
                  render={({ field: { onChange }, fieldState }) => {
                    return (
                      <PaymentMethods
                        cart={cart?.carts?.[0]}
                        errorMessage={fieldState?.error?.message}
                        isAuth={isAuth}
                        onChangePayment={(paymentCode) => {
                          setPaymentMessage("");
                          onChange(paymentCode);
                          setSelectedPaymentCode(paymentCode);
                        }}
                        paymentCode={selectedPaymentCode}
                        userPhone={userPhoneNumber}
                      />
                    );
                  }}
                />
              </div>

              {checkoutWarningMessages.length > 0 && (
                <CheckoutWarnings
                  warnings={checkoutWarningMessages}
                  selectedWarnings={checkoutWarningMessagesState}
                  onToggleWarning={handleToggleWarning}
                  onRemoveWarning={handleRemoveWarning}
                />
              )}

              <div className="mt-6 flex justify-end">
                <Button
                  // ref={(e) => {
                  //   console.log("aaaaaa", e);
                  // }}
                  size="large"
                  htmlType="submit"
                  type="primary"
                  loading={cartLoading}
                  className={` w-full max-w-80 rounded-lg h-12 payment-pay-button`}
                >
                  {cartLoading ? "Processing..." : "Төлбөр төлөх"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>

        <div className="flex flex-col gap-4">
          <CartItemList screen="address" />

          <PaymentInfo
            cartItem={cartItem}
            cartLoading={cartLoading}
            nextPath="/checkout/address"
            showNextButton={false}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutScreen;
