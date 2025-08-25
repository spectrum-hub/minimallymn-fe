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
    <Spin spinning={loading}>
      <div className="flex items-center justify-center p-4">
        <div className="max-w-md mt-2 md:mt-6 w-full bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">
            Нууц үг сэргээх
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="">
            <Controller
              control={control}
              name="phone"
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-sm font-medium  ">
                    Гар утасны дугаар
                  </label>
                  <Input
                    id="phone"
                    {...field}
                    placeholder="Утасны дугаар"
                    prefix={<Phone className="text-gray-400" />}
                    status={fieldState.invalid ? "error" : ""}
                    size="large"
                    className="input-class"
                  />
                </div>
              )}
            />

            {formName === "login_by_otp" ? (
              <Controller
                control={control}
                name={"verify_code"}
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
                      className="otp-input"
                      style={
                        isMobile
                          ? {
                              width: "90%",
                              height: 50,
                            }
                          : {}
                      }
                    />
                    {fieldState.invalid && (
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

            {!loading && formAction?.message && (
              <Alert
                message={formAction?.message}
                type={formAction?.success ? "success" : "error"}
                showIcon
                className="my-2"
              />
            )}

            <Button
              type={"primary"}
              htmlType="submit"
              loading={loading}
              className="w-full py-6 mt-4 text-[16px]"
              size="large"
            >
              Нууц үг сэргээх
            </Button>
          </form>

          <div className="my-6 text-md gap-2 flex flex-col md:flex-row justify-center items-center ">
            <span className="text-sm">Шинэ хэрэглэгч болох</span>
            <button
              onClick={navigateRegister}
              className=" text-blue-500 font-semibold md:text-sm text-lg border w-full my-2 py-2 rounded-md md:border-none md:w-auto "
              disabled={loading}
            >
              Бүртгүүлэх
            </button>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default MobileLoginScreen;
