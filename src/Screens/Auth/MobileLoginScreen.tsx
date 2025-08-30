import { FC, useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { Input, Button, Alert, Spin } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { mobileLoginAsync, validateOTPAsync } from "../../Redux/authActions";
import { useNavigate } from "react-router";
import { NOT_REGISTERED_STATUS_TXT } from "../../Constants";
import { REGISTER_USER } from "../../api/auth";
import { useMutation } from "@apollo/client";
import useWindowWidth from "../../Hooks/use-window-width";

export type FormName = "reset_password" | "login_by_otp";

interface FormSubmit {
  phone: string;
  verify_code?: string;
  formName: FormName;
  smsPassword?: string | null;
}

const MobileLoginScreen: FC = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  
  const navigateRegister = () => {
    navigate("/auth/register");
  };
  const [formAction, setFormAction] = useState<{
    message?: string;
    success?: boolean;
  }>();

  const { isMobile } = useWindowWidth();
  const [formName, setFormName] = useState<FormName>("reset_password");
  const [loading, setLoading] = useState<boolean>(authState?.loading);

  const [executeRegister] = useMutation(REGISTER_USER);

  const { control, handleSubmit, getValues } = useForm<FormSubmit>({
    defaultValues: {
      phone: "",
      verify_code: "",
      formName: "reset_password",
    },
  });

  useEffect(() => {
    setFormName("reset_password");
    setFormAction({});
  }, []);

  useEffect(() => {
    if (authState?.isAuthenticated) {
      navigate("/account/profile");
    }
  }, [authState?.isAuthenticated, navigate]);

  const onSubmit = async (data: FormSubmit) => {
    if (loading) return;

    setLoading(true);
    try {
      let response;
      if (formName === "login_by_otp") {
        response = await validateOTPAsync(
          data.phone,
          data.verify_code ?? ""
        )(dispatch);
      } else {
        response = await mobileLoginAsync(data.phone);

        if (response?.status === NOT_REGISTERED_STATUS_TXT) {
          /**
           *
           * Бүртгэлгүй хэрэгчлэгч
           *
           */

          console.log(response?.status);
        } else if (response?.success) {
          setFormName("login_by_otp");
        }
      }

      setFormAction({ ...response });
    } catch (err) {
      console.error("Error in onSubmit:", err);
    } finally {
      setLoading(false);
    }
  };

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
        console.log("handleResendOtpSubmit", result);
      } else {
        console.log("handleResendOtpSubmit", message);
      }
    } catch (r) {
      console.log("message", r);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 sm:px-6">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Нууц үг сэргээх
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Утасны дугаараар нууц үг сэргээх
            </p>
          </div>

          <Spin spinning={loading} tip="" className="relative">
            {loading && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl z-10" />}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                        {...field}
                        placeholder="99123456"
                        prefix={
                          <Phone
                            size={18}
                            className={
                              fieldState.invalid ? "text-red-400" : "text-gray-400"
                            }
                          />
                        }
                        status={fieldState.invalid ? "error" : ""}
                        disabled={loading}
                        size="large"
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
                    {fieldState?.error?.message && (
                      <p className="text-red-500 text-xs mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {formName === "login_by_otp" && (
                <Controller
                  control={control}
                  name={"verify_code"}
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
                          className="otp-input"
                          style={{
                            width: "100%",
                            height: isMobile ? 56 : 52,
                          }}
                        />
                      </div>
                      {fieldState.invalid && (
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

              {!loading && formAction?.message && (
                <div className={`p-4 rounded-xl text-sm ${
                  formAction?.success 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {formAction.message}
                </div>
              )}

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 border-none rounded-xl font-medium text-white shadow-sm"
                size="large"
                style={{
                  height: isMobile ? 56 : 48,
                  fontSize: isMobile ? 18 : 16,
                }}
              >
                {formName === "login_by_otp" 
                  ? (loading ? 'Шалгаж байна...' : 'Баталгаажуулах')
                  : (loading ? 'Илгээж байна...' : 'Нууц үг сэргээх')
                }
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Шинэ хэрэглэгч бол
                </p>
                <button
                  onClick={navigateRegister}
                  disabled={loading}
                  className="w-full py-3 px-4 text-blue-600 font-medium text-sm border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50"
                >
                  Бүртгүүлэх
                </button>
              </div>
            </div>
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default MobileLoginScreen;
