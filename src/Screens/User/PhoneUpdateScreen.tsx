import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import AccountLayout from "../../components/Layouts/account";
import { useNotification } from "../../Hooks/use-notification";
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
  otp: Yup.string().when("$isVerifying", (isVerifying, schema) =>
    isVerifying ? schema.required("Баталгаажуулах код оруулна уу") : schema
  ),
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
    if (otpRequested === false) {
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
      <div className="max-w-2xl mx-auto space-y-6">
        <UserInfoTab />
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-1">
              Утасны дугаар шинэчлэх
            </h1>
            <p className="text-sm text-gray-500">
              Одоогийн утас: <span className="font-medium text-gray-900">{phone}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
            <Controller
              control={control}
              name="phone"
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Шинэ утасны дугаар
                  </label>
                  <input
                    {...field}
                    id="phone"
                    disabled={otpRequested}
                    placeholder="+976XXXXXXXX"
                    className={`w-full px-4 py-3 rounded-lg border transition-colors 
                      focus:outline-none focus:ring-2 focus:ring-gray-900 
                      bg-white
                      focus:border-transparent ${
                      fieldState.error
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200 hover:border-gray-300"
                    } ${otpRequested ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  />
                  {fieldState.error && (
                    <p className="text-sm text-red-600">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />

            {message && message !== "Имэйл буруу форматтай байна." && (
              <div className={`p-3 rounded-lg text-sm ${
                success 
                  ? "bg-green-50 text-green-700 border border-green-200" 
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {message}
              </div>
            )}

            {otpRequested && (
              <div className="space-y-4">
                <Controller
                  control={control}
                  name="otp"
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <label htmlFor="otp" className="text-sm font-medium text-gray-700">
                        Баталгаажуулах код {countdown && (
                          <span className="text-gray-500">
                            ({Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")})
                          </span>
                        )}
                      </label>
                      <input
                        {...field}
                        id="otp"
                        placeholder="4 оронтой код"
                        maxLength={4}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                          fieldState.error
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      />
                      {fieldState.error && (
                        <p className="text-sm text-red-600">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />

                {countdown === 0 && (
                  <button
                    type="button"
                    onClick={() => requestOtp({ phone: currentPhone, otp: "" })}
                    disabled={isSubmitting}
                    className="text-sm text-gray-600 hover:text-gray-900 underline disabled:opacity-50"
                  >
                    Дахин код авах
                  </button>
                )}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || isSubmitting}
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading || isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {otpRequested ? "Баталгаажуулж байна..." : "Код илгээж байна..."}
                  </div>
                ) : (
                  <>
                    {otpRequested ? "Баталгаажуулах" : "Код авах"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AccountLayout>
  );
};

export default PhoneUpdateScreen;
