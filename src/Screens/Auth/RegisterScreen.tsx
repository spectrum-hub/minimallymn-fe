// RegisterScreen.tsx

import { FC, useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { Input, Button } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { registerSchema } from "../../lib/form-schemas";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../../api/auth";
import {  useSearchParams } from "react-router";
import { AUTH_SESSION_ID } from "../../Constants";
import { encryptData } from "../../lib/helpers";
import { loginSuccess } from "../../Redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import useWindowWidth from "../../Hooks/use-window-width";
import { useHistoryNavigate } from "../../Hooks/use-navigate";

interface FormSubmit {
  phone: string;
  smsPassword?: string | null;
}

const RegisterScreen: FC = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const { historyNavigate } = useHistoryNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const getPhone = searchParams.get("phone") ?? "";
  const { isMobile } = useWindowWidth();

  const [executeRegister] = useMutation(REGISTER_USER);

  const [loginStatus, setLoginStatus] = useState<string>("info");
  const [loginMessage, setLoginMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [isOtpSend, setIsOtpSend] = useState(false);

  const { control, handleSubmit, getValues } = useForm<FormSubmit>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      phone: getPhone ?? "",
    },
  });

  const handleResendOtp = async (phone: string) => {
    console.log("handleResendOtp", phone);
    setLoading(true);
    try {
      const result = await executeRegister({
        variables: {
          username: phone,
          smsPassword: phone,
          action: "resend_otp",
        },
      });

      const { success, message } = result?.data?.register ?? {};

      if (success) {
        setLoginMessage(message);
        setLoginStatus("success");

        console.log("handleResendOtpSubmit", result);
      } else {
        setLoginMessage(message || "OTP илгээхэд алдаа гарлаа.");
        setLoginStatus("error");
      }
    } catch {
      setLoginMessage("Алдаа гарлаа. Дахин оролдоно уу.");
      setLoginStatus("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState?.isAuthenticated) {
      historyNavigate("/account/profile");
    }
  }, [authState?.isAuthenticated, historyNavigate]);

  const onSubmit = async (formSubmit: FormSubmit) => {
    console.log({ formSubmit });
    setLoading(true);
    try {
      const phone = `${formSubmit.phone}`;

      const result = await executeRegister({
        variables: {
          username: phone,
          action: isOtpSend ? "otp_validate" : "register",
          smsPassword: formSubmit?.smsPassword,
        },
      });

      const registerResult = result?.data?.register;

      if (
        registerResult?.__typename === "RegisterResult" &&
        registerResult?.sessionId &&
        registerResult?.userId
      ) {
        localStorage.setItem(
          AUTH_SESSION_ID,
          encryptData(registerResult?.sessionId)
        );
        dispatch(
          loginSuccess({
            user: { phone },
            token: registerResult?.sessionId,
          })
        );
      }

      if (registerResult.success) {
        setLoginMessage(registerResult?.message);
        setLoginStatus("success");
        if (!isOtpSend) setIsOtpSend(true); // Move to OTP step
      } else {
        setLoginMessage(registerResult?.message || "Алдаа гарлаа.");
        setLoginStatus("error");
      }
    } catch (err: unknown) {
      console.log(err);
      setLoginMessage("Серверийн алдаа. Дахин оролдоно уу.");
      setLoginStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors: unknown) => {
    console.log(errors);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 sm:px-6">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Бүртгүүлэх
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Шинэ бүртгэл үүсгэх
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
            <Controller
              control={control}
              name="phone"
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Утасны дугаар
                  </label>
                  <div className="relative">
                    <Input
                      id="phone"
                      size="large"
                      name="phone"
                      defaultValue={getPhone}
                      onChange={(e) => field.onChange(e.target.value)}
                      prefix={
                        <Phone 
                          size={18}
                          className={fieldState.invalid ? "text-red-400" : "text-gray-400"} 
                        />
                      }
                      placeholder="99123456"
                      required
                      status={fieldState.invalid ? "error" : ""}
                      disabled={loading}
                      aria-describedby="phone-error"
                      className={`rounded-xl border-gray-200 ${
                        fieldState.invalid 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'hover:border-gray-300 focus:border-blue-500'
                      }`}
                      style={{
                        height: isMobile ? 52 : 48,
                        fontSize: isMobile ? 18 : 16,
                      }}
                    />
                  </div>
                  {fieldState.invalid && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldState.error?.message}
                    </p>
                  )}
                </div>
              )}
            />

            {isOtpSend && (
              <Controller
                control={control}
                name={"smsPassword"}
                render={({ field, fieldState }) => (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        Таны гар утсанд илгээсэн нэг удаагийн нууц үгийг оруулна уу
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <Input.OTP
                        length={4}
                        onChange={(e) => {
                          const onlyNumber = e.replace(/\D/g, "");
                          if (e !== onlyNumber) return;
                          field.onChange(e);
                        }}
                        size="large"
                        style={{
                          width: "100%",
                          height: isMobile ? 56 : 52,
                        }}
                      />
                    </div>
                    {fieldState?.invalid && (
                      <p className="text-red-500 text-xs text-center">
                        {fieldState.error?.message}
                      </p>
                    )}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => handleResendOtp(getValues("phone"))}
                        disabled={loading}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 disabled:opacity-50"
                      >
                        Дахин илгээх
                      </button>
                    </div>
                  </div>
                )}
              />
            )}

            {loginMessage && (
              <div className={`p-4 rounded-xl text-sm ${
                loginStatus === "success"
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {loginMessage}
              </div>
            )}

            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={loading}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 border-none rounded-xl font-medium text-white shadow-sm"
              style={{
                height: isMobile ? 56 : 48,
                fontSize: isMobile ? 18 : 16,
              }}
            >
              {isOtpSend 
                ? (loading ? 'Баталгаажуулж байна...' : 'Баталгаажуулах')
                : (loading ? 'Бүртгүүлж байна...' : 'Бүртгүүлэх')
              }
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Та бүртгэлтэй хэрэглэгч бол
              </p>
              <button
                onClick={() => historyNavigate("/auth/login")}
                disabled={loading}
                className="w-full py-3 px-4 text-blue-600 font-medium text-sm border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50"
              >
                Нэвтрэх
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterScreen;
