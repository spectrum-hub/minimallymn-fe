import { FC, useContext, useEffect } from "react";
import { Phone, Lock } from "lucide-react";
import { Input, Button, Alert, Spin } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { loginAsync } from "../../Redux/authActions";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../lib/form-schemas";
import { NOT_REGISTERED_STATUS_TXT } from "../../Constants";
import useWindowWidth from "../../Hooks/use-window-width";
import { DrawerContext } from "../../context/DrawerContext";
import { scrollToTop } from "../../lib/helpers";
import { useHistoryNavigate } from "../../Hooks/use-navigate";

export type FormName = "login" | "reset_password" | "login_by_otp";

interface FormSubmit {
  phone: string;
  password: string;
}

const AuthScreen: FC<{
  isDrawer?: boolean;
}> = ({ isDrawer = false }) => {
  const drawerCtx = useContext(DrawerContext);

  const dispatch: AppDispatch = useDispatch();
 const { historyNavigate } = useHistoryNavigate();
  const authState = useSelector((state: RootState) => state.auth);
  const { isMobile } = useWindowWidth();

  const { loading } = authState;

  const { control, handleSubmit } = useForm<FormSubmit>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const navigateLink = (link: "register" | "reset") => {
    if (link === "register") {
      historyNavigate("/auth/register");
    } else {
      historyNavigate("/auth/reset-password");
    }

    drawerCtx.closeDrawer();
    scrollToTop();
  };

  useEffect(() => {
    if (authState?.isAuthenticated && !isDrawer) {
      historyNavigate("/account/profile");
    }
  }, [authState?.isAuthenticated, isDrawer, historyNavigate]);

  const onSubmit = async (data: FormSubmit) => {
    if (authState.loading) {
      return;
    }

    try {
      dispatch(loginAsync(data.phone, data.password)).then((r) => {
        if (r.type === NOT_REGISTERED_STATUS_TXT) {
          historyNavigate(
            "/auth/register?message=дугаар бүртгэлгүй байна&phone=" + data.phone
          );
        }
      });
    } catch (err) {
      console.log(err);
    } finally {
      console.log("error");
    }
  };

  return (
    <Spin spinning={loading}>
      <div
        className={`
          flex items-center justify-center ${isDrawer ? " " : " p-0 md:p-4 "}
        `}
      >
        <div className="max-w-md mt-2 md:mt-6 w-full bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Нэвтрэх</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              control={control}
              name="phone"
              render={({ field, fieldState }) => (
                <div>
                  <label htmlFor="phone" className="text-sm font-medium">
                    Утас
                  </label>
                  <Input
                    id="phone"
                    {...field}
                    placeholder="Утасны дугаар"
                    prefix={
                      <Phone
                        size={20}
                        className={
                          fieldState.invalid ? "text-red-400" : "text-gray-400"
                        }
                      />
                    }
                    status={fieldState.invalid ? "error" : ""}
                    disabled={loading}
                    size={isMobile ? undefined : "large"}
                    style={
                      isMobile
                        ? {
                            height: 50,
                            fontSize: 20,
                          }
                        : {}
                    }
                  />

                  <span className="text-red-500 font-bold text-xs ">
                    {fieldState?.error?.message}
                  </span>
                </div>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <div>
                  <label htmlFor="pass" className="text-sm font-medium">
                    Нууц үг
                  </label>
                  <Input.Password
                    id="pass"
                    {...field}
                    placeholder="Нууц үг"
                    prefix={
                      <Lock
                        size={20}
                        className={
                          fieldState.invalid ? "text-red-400" : "text-gray-400 "
                        }
                      />
                    }
                    status={fieldState.invalid ? "error" : ""}
                    disabled={loading}
                    size={isMobile ? undefined : "large"}
                    style={
                      isMobile
                        ? {
                            height: 50,
                            fontSize: 20,
                          }
                        : {}
                    }
                  />
                  <span className="text-red-500 font-bold text-xs ">
                    {fieldState?.error?.message}
                  </span>
                </div>
              )}
            />

            {!loading && authState?.message && (
              <Alert
                message={authState?.message}
                type={authState.error ? "error" : "success"}
                showIcon
              />
            )}

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
              size={isMobile ? undefined : "large"}
              style={
                isMobile
                  ? {
                      height: 50,
                      fontSize: 20,
                    }
                  : {}
              }
            >
              Нэвтрэх
            </Button>
          </form>

          <div
            className="mx-auto text-sm  my-2 flex w-full 
            md:flex-row gap-0 justify-end items-center 
            flex-col
          "
          >
            <span>Нууц үгээ мартсан бол</span>
            <Button
              type="link"
              className="font-bold text-2xl md:text-sm"
              onClick={() => navigateLink("reset")}
              loading={loading}
            >
              энд дарна уу
            </Button>
          </div>

          <div className="my-6 text-md gap-2 flex flex-col md:flex-row justify-center items-center ">
            <span className="text-sm">Шинэ хэрэглэгч болох</span>
            <button
              onClick={() => navigateLink("register")}
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

export default AuthScreen;
