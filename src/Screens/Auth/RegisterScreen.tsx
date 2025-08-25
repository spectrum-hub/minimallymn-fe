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
    <div className=" flex items-center justify-center p-4">
      <div className="max-w-md mt-2 md:mt-6 w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl text-center md:text-2xl font-bold text-gray-900 dark:text-white mb-8 mt-6">
          Бүртгүүлэх
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Утас
            </label>
            <Controller
              control={control}
              name="phone"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="phone"
                    size="large"
                    name="phone"
                    defaultValue={getPhone}
                    onChange={(e) => field.onChange(e.target.value)}
                    prefix={<Phone className="w-5 h-5 text-gray-400" />}
                    placeholder="Гар утасны дугаар"
                    required
                    status={fieldState.invalid ? "error" : ""}
                    disabled={loading}
                    aria-describedby="phone-error"
                    style={
                      isMobile
                        ? {
                            height: 50
                          }
                        : {}
                    }
                  />
                  {fieldState.invalid && (
                    <span id="phone-error" className="text-red-500 text-sm">
                      {fieldState.error?.message}
                    </span>
                  )}
                </>
              )}
            />

            {isOtpSend ? (
              <Controller
                control={control}
                name={"smsPassword"}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-4 my-4 items-center w-full">
                    <span className="text-sm text-center my-4 text-gray-600">
                      Таны гар утсанд илгээсэн нэг удаагийн нууц үгийг оруулна
                      уу
                    </span>
                    <Input.OTP
                      length={4}
                      onChange={(e) => {
                        const onlyNumber = e.replace(/\D/g, "");
                        console.log(onlyNumber);
                        if (e !== onlyNumber) return;
                        field.onChange(e);
                      }}
                      size={"large"}
                      style={
                        isMobile
                          ? {
                              width: "90%",
                              height: 70
                            }
                          : {}
                      }
                    />

                    {fieldState?.invalid && (
                      <span id="phone-error" className="text-red-500 text-sm">
                        {fieldState.error?.message}
                      </span>
                    )}
                    <Button
                      loading={loading}
                      size={"small"}
                      type={"link"}
                      disabled={false}
                      onClick={() => handleResendOtp(getValues("phone"))}
                      className="float-right"
                    >
                      Дахин илгээх
                    </Button>
                  </div>
                )}
              />
            ) : null}
          </div>

          {loginMessage && (
            <div
              className={`p-2 rounded text-sm ${
                loginStatus === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {loginMessage}
            </div>
          )}

          <Button
            type="primary"
            size="large"
            htmlType={"submit"}
            block
            loading={loading}
            disabled={loading}
            className="
              text-[16px] py-5
              md:text-[18px]
              my-6
            "
          >
            Бүртгүүлэх
          </Button>
        </form>

        {/* Toggle between login and register */}
        <div className="text-center text-sm my-4">
          <span className="text-gray-500 dark:text-gray-400">
            Та бүртгэлтэй хэрэглэгч бол
          </span>
          <button
            onClick={() => historyNavigate("/auth/login")}
            className={`
                  ml-2 text-indigo-600 dark:text-indigo-400 
                  font-medium hover:underline focus:outline-none
                  border w-full text-lg my-4 py-2 rounded-md
                  md:border-none md:w-auto 
                `}
          >
            Нэвтрэх
          </button>
        </div>
        {/* Footer */}
        {/* <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          By continuing, you agree to our{" "}
          <Button type="link" className="p-0">
            Terms of Service
          </Button>{" "}
          and{" "}
          <Button type="link" className="p-0">
            Privacy Policy
          </Button>
        </p> */}
      </div>
    </div>
  );
};
export default RegisterScreen;
