/* eslint-disable @typescript-eslint/no-unused-vars */
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

  const [selectedPaymentCode, setSelectedPaymentCode] =
    useState<string>("wire_transfer");
  const [userPhoneNumber, setUserPhoneNumber] = useState<string>();
  const [deliveryId, setDeliveryId] = useState<number | undefined>();
  const [customerType, setCustomerType] = useState<CustomerType>("citizen");

  const [checkoutWarningMessagesState, setCheckoutWarningMessagesState] =
    useState<Record<number, string> | undefined>();

  // Toggle warning message
  const handleToggleWarning = (id: number, text: string) => {
    setCheckoutWarningMessagesState((prev) => {
      if (!prev) return { [id]: text };
      if (prev[id]) {
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

  // Form setup
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

  const { control, setValue, reset, handleSubmit, getValues, formState } =
    formMethods;
  const cartItem = cart?.carts?.[0];

  const [executeCreateOrder] = useMutation(CREATE_ORDER_CHECKOUT);

  // Set user info
  useEffect(() => {
    if (userData?.fullname) {
      reset({
        firstname:
          userData.fullname === userData.phone ? "" : userData.fullname,
        s_phone: userData.phone,
        email: userPartnerData?.email,
      });
      setUserPhoneNumber(userData.phone);
    }
  }, [userData, userPartnerData, reset]);
  // Sync loading
  useEffect(() => {
    setCartLoading(loading);
  }, [loading]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      historyNavigate(
        "/auth/login?notification=Худалдан авалтаа үргэлжлүүлхийн тулд нэвтэрнэ үү"
      );
    }
  }, [isAuthenticated, historyNavigate]);

  // Submit order
  const onSubmit = async (data: StepValues) => {
    if (!selectedAddressText) {
      openNotification({
        type: "warning",
        body: <div>Хүргэлтийн хаяг сонгоно уу</div>,
      });
      return;
    }

    setCartLoading(true);

    const checkoutWarningMessages =
      Object.values(checkoutWarningMessagesState ?? {}).join(", ") || undefined;

    try {
      const result = await executeCreateOrder({
        variables: {
          address: selectedAddressText,
          phone: data.s_phone,
          name: data.firstname,
          email: data.email,
          note: selectedAddressText,
          paymentMethod: selectedPaymentCode,
          deliveryMethod: deliveryId,
          checkoutWarningMessages,
        },
      });

      const orderResult = result?.data?.checkoutOrder;

      if (orderResult?.isSuccess) {
        await dispatch(getCartAsync());
        historyNavigate(`/orders/${orderResult.values?.order_id}`);
      } else {
        openNotification({
          type: "error",
          body: <div>Захиалга амжилтгүй боллоо</div>,
        });

        if (
          selectedPaymentCode === "storepay" &&
          orderResult?.values?.status === "Failed"
        ) {
          const msg =
            orderResult.values.payment_response?.msgList?.[0]?.text ||
            "Storepay амжилтгүй боллоо";
          setPaymentMessage(`${userPhoneNumber} - дугаартай ${msg}`);
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      openNotification({
        type: "error",
        body: <div>--------Сервертэй холбогдоход алдаа гарлаа</div>,
      });
    } finally {
      setCartLoading(false);
    }
  };

  // Render input
  const renderInput = (name: keyof StepValues, label: string) => (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Form.Item
          label={label}
          validateStatus={fieldState.error ? "error" : ""}
          help={fieldState.error?.message}
          layout="vertical"
        >
          <Input
            {...field}
            onChange={(e) => {
              field.onChange(e);
              if (name === "s_phone") setUserPhoneNumber(e.target.value);
            }}
            value={field.value ?? ""}
            className="w-full max-w-64"
            size="large"
          />
        </Form.Item>
      )}
    />
  );

  if (!cartItem?.orderLines?.length) return <EmptyCart />;

  return (
    <div className="form-payment-delivery-address py-2 bg-gradient-to-b from-gray-50 to-white px-0">
      <div className="grid lg:grid-cols-3 gap-4 mx-auto">
        <div className="lg:col-span-2">
          <FormProvider {...formMethods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white shadow-lg rounded-xl p-4 max-w-[700px]"
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
                  setSelectedAddress={(s) => {
                    setSelectedAddressText(s);
                    setValue("address", s);
                  }}
                />
              </div>

              <div className="space-y-4">
                <h2 className="font-bold text-md">Хүргэлтийн төлбөр</h2>
                <Controller
                  control={control}
                  name="deliveryId"
                  render={({ field, fieldState }) => (
                    <ShipmentMethods
                      cart={cart?.carts?.[0]}
                      value={field.value}
                      onChange={(id: number) => {
                        field.onChange(id);
                        setDeliveryId(id);
                        /// setdeliveryIdFunc(id);
                      }}
                      message={fieldState?.error?.message}
                    />
                  )}
                />

                <h2 className="font-bold text-md">Төлбөрийн сонголт</h2>

                {selectedPaymentCode === "storepay" && paymentMessage && (
                  <ErrorMessege
                    message={paymentMessage}
                    messageBold={getValues("paymentCode")}
                  />
                )}

                <Controller
                  control={control}
                  name="paymentCode"
                  render={({ field: { onChange }, fieldState }) => (
                    <PaymentMethods
                      cart={cart?.carts?.[0]}
                      errorMessage={fieldState?.error?.message}
                      isAuth={isAuth}
                      onChangePayment={(code) => {
                        setPaymentMessage("");
                        onChange(code);
                        setSelectedPaymentCode(code);
                      }}
                      paymentCode={selectedPaymentCode}
                      userPhone={userPhoneNumber}
                    />
                  )}
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
                  size="large"
                  htmlType="submit"
                  type="primary"
                  loading={cartLoading}
                  className="w-full max-w-80 rounded-lg h-12 payment-pay-button"
                  onClick={() => {
                    if (Object.keys(formState.errors).length > 0) {
                      openNotification({
                        type: "error",
                        body: (
                          <div>
                            Мэдээллээ бүрэн бөглөнө үү
                            {Object.entries(formState.errors).map(
                              ([key, error]) => (
                                <div key={key} className="text-xs">
                                  • {error?.message || key}
                                </div>
                              )
                            )}
                          </div>
                        ),
                      });
                    }
                  }}
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
