import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { userInfoAsync, userInfoUpdateAsyncNew } from "../../Redux/userActions";
import AccountLayout from "../../components/Layouts/account";
import { useNotification } from "../../Hooks/use-notification";
import { useHistoryNavigate } from "../../Hooks/use-navigate";

const AccountFormSchema = Yup.object().shape({
  name: Yup.string().required("Заавал бөглөх"),
});

interface FormType {
  name: string;
  email?: string;
}

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } =
    useSelector((state: RootState) => state.userInfo) ?? {};

  const { street, name, email } = data?.userInfo?.pdata ?? {};

  const authState = useSelector((state: RootState) => state.auth);

  const { historyNavigate } = useHistoryNavigate();
  useEffect(() => {
    if (!authState?.isAuthenticated) {
      historyNavigate("/auth/login");
      // /account/orders/4Io=
    }
  }, [authState?.isAuthenticated, historyNavigate]);

  //  const loginPhone = data?.userInfo?.userData?.login

  const { openNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { control, handleSubmit, reset, setValue } = useForm<FormType>({
    resolver: yupResolver(AccountFormSchema),
    defaultValues: {
      name: name,
      email: email,
    },
  });

  // Анхны утгуудыг тавих
  useEffect(() => {
    if (data?.userInfo?.userData) {
      reset({
        name,
        email: email,
      });
    }
  }, [data, email, name, reset, setValue, street]);

  const onSubmit = async (formData: FormType) => {
    setIsSubmitting(true);
    try {
      const result = await dispatch(
        userInfoUpdateAsyncNew({
          name: formData.name,
          email: formData.email,
        })
      );

      dispatch(userInfoAsync());

      openNotification({
        body: result.message ?? "Мэдээлэл амжилттай шинэчлэгдлээ!",
        type: "success",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Тодорхойгүй алдаа";
      openNotification({
        body: `Мэдээлэл шинэчлэхэд алдаа гарлаа: ${errorMessage}`,
        type: "error",
      });
      console.error("Profile Update Error:", error);
    } finally {
      setIsSubmitting(false);
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-1">
              Хувийн мэдээлэл
            </h1>
            <p className="text-sm text-gray-500">
              Таны дансны үндсэн мэдээллийг шинэчлэх
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="space-y-6"
          >
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Овог, нэр
                  </label>
                  <input
                    {...field}
                    id="name"
                    className={`w-full px-4 py-3 rounded-lg border transition-colors 
                      focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white
                      focus:border-transparent ${
                        fieldState.error
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    placeholder="Овог, нэрээ оруулна уу"
                  />
                  {fieldState.error && (
                    <p className="text-sm text-red-600">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    И-мэйл хаяг
                  </label>
                  <input
                    {...field}
                    id="email"
                    value={
                      String(field.value) === "false" ? "" : String(field.value)
                    }
                    type="email"
                    className={`w-full px-4 py-3 rounded-lg border transition-colors 
                      focus:outline-none focus:ring-2 focus:ring-gray-900 
                      focus:border-transparent bg-white ${
                      fieldState.error
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="И-мэйл хаягаа оруулна уу"
                  />
                  {fieldState.error && (
                    <p className="text-sm text-red-600">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || isSubmitting}
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading || isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Хадгалж байна...
                  </div>
                ) : (
                  "Мэдээлэл хадгалах"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AccountLayout>
  );
};

export default ProfileScreen;
