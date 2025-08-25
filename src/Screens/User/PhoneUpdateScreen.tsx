import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Button, Form, Input } from "antd";
import AccountLayout from "../../components/Layouts/account";
import { useNotification } from "../../Hooks/use-notification";
import styles from "./user.module.css";
import { userPhoneUpdateAsync } from "../../Redux/userActions";
import UserInfoTab from "../../components/User/UserInfoSelectTab";

// React Component
interface FormType {
  phone: string;
  otp?: string;
}

const AccountFormSchema = Yup.object().shape({
  phone: Yup.string()
    .required("Заавал бөглөх")
    .matches(/^\+?[1-9]\d{7,14}$/, "Утасны дугаар буруу форматтай"),
  otp: Yup.string().when("$isVerifying", {
    is: true,
    then: (schema) => schema.required("Баталгаажуулах код оруулна уу"),
    otherwise: (schema) => schema,
  }),
});

const PhoneUpdateScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, message, success } =
    useSelector((state: RootState) => state.userInfo) ?? {};
  const phone = data?.userInfo?.userData?.login ?? "";

  const { openNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [otpRequested, setOtpRequested] = React.useState(false);
  const [countdown, setCountdown] = React.useState<number | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    // formState: { errors },
  } = useForm<FormType>({
    resolver: yupResolver(AccountFormSchema),
    defaultValues: { phone: phone ?? "", otp: "" },
    context: { isVerifying: otpRequested },
  });

  const currentPhone = watch("phone");

  useEffect(() => {
    if (phone) {
      reset({ phone, otp: "" });
    }
  }, [phone, reset]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev ? prev - 1 : null));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const requestOtp = async (formData: FormType) => {
    setIsSubmitting(true);
    try {
      const result = await dispatch(
        userPhoneUpdateAsync({
          phone: formData.phone,
          action: "request_otp",
        })
      );

      if (result.success) {
        setOtpRequested(true);
        setCountdown(result.expiresIn || 300);
        openNotification({
          body: "Баталгаажуулах код илгээлээ",
          type: "success",
        });
      }
    } catch (error) {
      openNotification({
        body: `Код авахад алдаа гарлаа: ${(error as Error).message}`,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyAndUpdate = async (formData: FormType) => {
    setIsSubmitting(true);
    try {
      const result = await dispatch(
        userPhoneUpdateAsync({
          phone: formData.phone,
          otp: formData.otp,
          action: "verify_otp",
        })
      );

      if (result.success) {
        setOtpRequested(false);
        setCountdown(null);
        openNotification({
          body: "Утасны дугаар амжилттай шинэчлэгдлээ",
          type: "success",
        });
        location.reload();
      }
    } catch (error) {
      openNotification({
        body: `Баталгаажуулалт амжилтгүй: ${(error as Error).message}`,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (formData: FormType) => {
    if (!otpRequested) {
      requestOtp(formData);
    } else {
      verifyAndUpdate(formData);
    }
  };

  const onError = () => {
    openNotification({
      body: "Шаардлагатай талбарыг зөв бөглөнө үү!",
      type: "error",
      placement: "top",
    });
  };

  return (
    <AccountLayout>
      <UserInfoTab />
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className={styles.itemContainer}
      >
        <h2 className={styles.title}>Утасны дугаар шинэчлэх</h2>

        <div className=" my-4 text-sm text-blue-800">
          Хэрэглэгчийн утасны дугаар: <b>{phone}</b>
        </div>
        <Controller
          control={control}
          name="phone"
          render={({ field, fieldState }) => (
            <Form.Item
              label="Утасны дугаар"
              layout="vertical"
              help={fieldState.error?.message}
              validateStatus={fieldState.error ? "error" : ""}
            >
              <Input
                {...field}
                disabled={otpRequested}
                placeholder="+976XXXXXXXX"
                className="w-full"
              />
            </Form.Item>
          )}
        />

        <span
          className={`text-sm mt-6 font-bold block ${
            success ? "text-green-500" : "text-red-600"
          }`}
        >
          {message === "Имэйл буруу форматтай байна." ||
          message === "Имэйл буруу форматтай байна"
            ? ""
            : message}
        </span>
        {otpRequested && (
          <>
            <Controller
              control={control}
              name="otp"
              render={({ field, fieldState }) => (
                <Form.Item
                  label={`Баталгаажуулах код (${
                    countdown
                      ? `${Math.floor(countdown / 60)}:${(countdown % 60)
                          .toString()
                          .padStart(2, "0")}`
                      : "0:00"
                  })`}
                  layout="vertical"
                  help={fieldState.error?.message}
                  validateStatus={fieldState.error ? "error" : ""}
                >
                  <Input
                    {...field}
                    placeholder="4 оронтой код"
                    maxLength={4}
                    className="w-full"
                  />
                </Form.Item>
              )}
            />
            {countdown === 0 && (
              <Button
                onClick={() => requestOtp({ phone: currentPhone, otp: "" })}
                disabled={isSubmitting}
              >
                Дахин код авах
              </Button>
            )}
          </>
        )}

        <Button
          size="large"
          htmlType="submit"
          type="primary"
          loading={loading || isSubmitting}
          className="w-full max-w-xs"
        >
          {otpRequested ? "Баталгаажуулах" : "Код авах"}
        </Button>
      </form>
    </AccountLayout>
  );
};

export default PhoneUpdateScreen;
