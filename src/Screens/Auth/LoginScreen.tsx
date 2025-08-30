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
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 ${isDrawer ? 'min-h-full bg-transparent' : 'px-4 py-8 sm:px-6'}`}>
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Нэвтрэх</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">Өөрийн бүртгэлдээ нэвтрэх</p>
          </div>

          <Spin spinning={loading} tip="" className="relative">
            {loading && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl z-10" />}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
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

              <Controller
                control={control}
                name="password"
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <label htmlFor="pass" className="block text-sm font-medium text-gray-700">
                      Нууц үг
                    </label>
                    <div className="relative">
                      <Input.Password
                        id="pass"
                        {...field}
                        placeholder="••••••••"
                        prefix={
                          <Lock
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

              {!loading && authState?.message && (
                <div className={`p-4 rounded-xl text-sm ${
                  authState.error 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {authState.message}
                </div>
              )}

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 border-none rounded-xl font-medium text-white"
                size="large"
                style={{
                  height: 48,
                  fontSize: 16,
                }}
              >
                {loading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigateLink("reset")}
                disabled={loading}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Нууц үгээ мартсан уу?
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Шинэ хэрэглэгч бол
                </p>
                <button
                  onClick={() => navigateLink("register")}
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

export default AuthScreen;
