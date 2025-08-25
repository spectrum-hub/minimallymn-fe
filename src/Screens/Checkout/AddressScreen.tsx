/* eslint-disable @typescript-eslint/no-explicit-any */
import locations from "../../lib/locations.json";
import { useMutation } from "@apollo/client";
import { Form, Select, Button, Input } from "antd";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider, Controller } from "react-hook-form";

import EmptyCart from "../../components/cart/Empty";
import { useDispatch, useSelector } from "react-redux";
import { shipmentLocations } from "../../lib/checkout";
import { AppDispatch, RootState } from "../../Redux/store";
import CartItemList from "../../components/cart/CartItemList";
import PaymentInfo from "../../components/Checkout/PaymentInfo";
import { validSchema2 } from "../../lib/form-schemas";
import CustomerTypeComp from "../../components/Checkout/CustomerType";
import PaymentMethods from "../../components/Checkout/PaymentMethods";
import ShipmentMethods from "../../components/Checkout/ShipmentMethods";
import { CustomerType, LocationNType, StepValues } from "../../types/Common";
import { CREATE_ORDER_CHECKOUT, setDeliveryMethodGQL } from "../../api/cart";

import { getCartAsync } from "../../Redux/cartActions";
import { useCart } from "../../Hooks/use-cart";
import { Context } from "../../context/NotificationCtx";
import ErrorMessege from "../../components/Checkout/ErrorMessege";
import { useHistoryNavigate } from "../../Hooks/use-navigate";

const isFalseLocation = (value?: string) => {
  return value === "false" ? "" : value;
};

export interface Locations {
  city?: string;
  district?: string;
  baghoroo?: string;
}

const CheckoutScreen: React.FC = () => {
  const { openNotification } = useContext(Context);

  const { historyNavigate } = useHistoryNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const { cart, loading } = useSelector((state: RootState) => state.cart);

  const { refetchCart } = useCart();

  const { isAuthenticated } = authState ?? {};
  const userData = userInfo?.data?.userInfo?.userData;
  const userPartnerData = userInfo?.data?.userInfo?.pdata;

  const isAuth = isAuthenticated && !!userData?.login;

  const [paymentMessage, setPaymentMessage] = useState<string>("");

  const [cartLoading, setCartLoading] = useState(loading);
  const [locationsState, setLocationsState] = useState<Locations>({
    city: "11",
  });

  const [selectedPaymentCode, setSelectedPaymentCode] =
    useState<string>("wire_transfer");
  const [userPhoneNumber, setUserPhoneNumber] = useState<string>();

  const [deliveryId, setDeliveryId] = useState<number>();
  const [isDeliverySet, setIsDeliverySet] = useState<boolean>(false);

  // const [addressDetail, setAddressDetail] = useState<Partial<Locations>>();
  const [customerType, setCustomerType] = useState<CustomerType>("citizen");
  const [orderCreateStatus, setOrderCreateStatus] = useState<
    "pending" | "failed" | "success"
  >("pending");

  const formMethods = useForm<StepValues>({
    resolver: yupResolver(validSchema2),
    defaultValues: {
      city: userData?.city_id === "false" ? "11" : userData?.city_id,
      district: isFalseLocation(userData?.district_id),
      baghoroo: isFalseLocation(userData?.baghoroo_id),
      firstname: userData?.name,
      s_phone: userData?.login,
      email: userPartnerData?.email,
      s_address: userPartnerData?.street,
      paymentCode: "wire_transfer",
      deliveryId: undefined,
    },
  });

  const {
    control,
    watch,
    resetField,
    setValue,
    reset,
    handleSubmit,
    getValues,
  } = formMethods;

  const typedLocations = locations as LocationNType;
  const cityValue = watch("city");
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
    if (userData?.name) {
      reset({
        city: userData?.city_id === "false" ? "11" : userData?.city_id,
        district: isFalseLocation(userData?.district_id),
        baghoroo: isFalseLocation(userData?.baghoroo_id),
        firstname: userData?.name === userData?.login ? "" : userData?.name,
        s_phone: userData?.login,
        email: userPartnerData?.email,
        s_address: userPartnerData?.street,
      });
      setUserPhoneNumber(userData?.login);
    }
  }, [userData, reset, userPartnerData, isAuth]);

  useEffect(() => {
    setCartLoading(loading);
  }, [loading]);

  useEffect(() => {
    const initialCity = cityValue || "11";
    if (!locationsState.city) {
      updateLocation({ city: initialCity });
      // setAddressDetail((prev) => ({
      //   ...prev,
      //   city: typedLocations[initialCity]?.label,
      // }));
      setValue("city", initialCity);
    }
  }, [cityValue, locationsState.city, setValue, typedLocations]);

  const computedShipmentLocations = shipmentLocations(
    cityValue,
    watch("district")
  );

  const updateLocation = (newLocations: Locations) => {
    setLocationsState((prev) => ({ ...prev, ...newLocations }));
  };

  const handleSelectChange = (
    value: string | number,
    field: any,
    name: keyof StepValues,
    resetFields?: (keyof StepValues)[]
  ) => {
    field.onChange(value);
    updateLocation({ [name]: value });
    // setAddressDetail((prev) => ({
    //   ...prev,
    //   [name]: option.label,
    // }));
    resetFields?.forEach((field) => resetField(field));
  };

  const onSubmit = async (data: StepValues) => {
    try {
      const { s_address, s_phone, firstname, email } = data;

      setCartLoading(true);
      const result = await executeCreateOrder({
        variables: {
          address: s_address,
          phone: s_phone,
          name: firstname,
          email,
          note: s_address,
          paymentMethod: selectedPaymentCode,
          deliveryMethod: deliveryId,
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

        if (selectedPaymentCode === "storepay" && paymentResult.status === "Failed") {
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

  const renderSelect = (
    name: keyof StepValues,
    label: string,
    options: any[],
    disabled?: boolean,
    resetFields?: (keyof StepValues)[]
  ) => (
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
          <Select
            {...field}
            onChange={(value) => {
              console.log(value);
              if (value === "false") {
                console.log(value);
              }
              handleSelectChange(value, field, name, resetFields);
            }}
            className="min-w-36 max-w-64"
            options={options}
            disabled={disabled}
            size={"large"}
          />
        </Form.Item>
      )}
    />
  );

  if (!cartItem?.orderLines?.length) {
    return <EmptyCart />;
  }

  console.log(orderCreateStatus);

  console.log("selectedPaymentCode", selectedPaymentCode);
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
                <h2 className="form-address-title">Хүргэлтийн хаяг</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {renderSelect(
                    "city",
                    "Хот/Аймаг",
                    Object.values(typedLocations),
                    false,
                    ["district", "baghoroo"]
                  )}
                  {renderSelect(
                    "district",
                    "Дүүрэг/Сум",
                    computedShipmentLocations?.districts,
                    !cityValue,
                    ["baghoroo"]
                  )}

                  {renderSelect(
                    "baghoroo",
                    "Хороо/Баг",
                    computedShipmentLocations?.baghoroo || [],
                    !watch("district")
                  )}
                </div>
                <Controller
                  control={control}
                  name="s_address"
                  render={({ field, fieldState }) => (
                    <Form.Item
                      label={
                        <span className="text-gray-700 ">
                          Хүргэлтийн дэлгэрэнгүй хаяг, Нэмэлт тайлбар
                        </span>
                      }
                      validateStatus={fieldState.error ? "error" : ""}
                      help={fieldState.error?.message}
                      layout="vertical"
                    >
                      <Input.TextArea
                        {...field}
                        value={
                          String(field.value) === "false" ? "" : field.value
                        }
                        rows={4}
                        className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all"
                      />
                    </Form.Item>
                  )}
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
