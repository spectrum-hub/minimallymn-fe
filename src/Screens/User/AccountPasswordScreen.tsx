import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import AccountLayout from "../../components/Layouts/account";
import { useNotification } from "../../Hooks/use-notification";
import UserInfoTab from "../../components/User/UserInfoSelectTab";
import { gql } from "@apollo/client";
import { apolloClient } from "../../lib/apolloClient";

// React Component
interface FormType {
  username?: string; // Add this
  oldPassword?: string;
  newPassword: string;
  newPasswordRepeat: string;
  smsPassword?: string; // Add this for OTP
}

const AccountFormSchema = Yup.object().shape({
  newPassword: Yup.string().required("Заавал бөглөх"),
  newPasswordRepeat: Yup.string().required("Заавал бөглөх"),
  smsPassword: Yup.string().optional(),
});

const RESET_PASSWORD_GQL = gql`
  mutation resetPassword($password: String!, $password2: String!) {
    resetPassword(password: $password, password2: $password2) {
      success
      message
      sessionId
      desc
    }
  }
`;

const AccountPasswordScreen: React.FC = () => {
  const { data, loading, message, success } =
    useSelector((state: RootState) => state.userInfo) ?? {};
  const { openNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [step, setStep] = React.useState<"request" | "verify">("request"); // Add step state

  const { control, handleSubmit, reset } = useForm<FormType>({
    resolver: yupResolver(AccountFormSchema),
    defaultValues: {
      username: data?.username ?? "",
    },
  });

  const onSubmit = async (formData: FormType) => {
    setIsSubmitting(true);

    if (formData.newPassword !== formData.newPasswordRepeat) {
      openNotification({
        body: "Шинэ нууц үг таарахгүй байна!",
        type: "error",
        placement: "top",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await apolloClient.mutate({
        mutation: RESET_PASSWORD_GQL,
        variables: {
          password: formData?.newPassword,
          password2: formData?.newPasswordRepeat,
        },
      });

      if (result?.data?.resetPassword?.success) {
        openNotification({
          body: "Нууц үг амжилттай шинэчлэгдлээ!",
          type: "success",
          placement: "top",
        });
        reset();
        setStep("request");
      }
    } catch (error) {
      openNotification({
        body:
          error instanceof Error
            ? error.message
            : "Нууц үг шинэчлэхэд алдаа гарлаа!",
        type: "error",
        placement: "top",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AccountLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <UserInfoTab />
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-1">
              Нууц үг шинэчлэх
            </h1>
            <p className="text-sm text-gray-500">
              Аккаунтын аюулгүй байдлыг сахиулах зорилгоор нууц үгээ шинэчлэнэ үү
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              control={control}
              name="newPassword"
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                    Шинэ нууц үг
                  </label>
                  <input
                    {...field}
                    id="newPassword"
                    type="password"
                    className={`w-full bg-white px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                      fieldState.error
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Шинэ нууц үгээ оруулна уу"
                  />
                  {fieldState.error && (
                    <p className="text-sm text-red-600">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="newPasswordRepeat"
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <label htmlFor="newPasswordRepeat" className="text-sm font-medium text-gray-700">
                    Нууц үг давтах
                  </label>
                  <input
                    {...field}
                    id="newPasswordRepeat"
                    type="password"
                    className={`w-full px-4  bg-white py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                      fieldState.error
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Нууц үгээ дахин оруулна уу"
                  />
                  {fieldState.error && (
                    <p className="text-sm text-red-600">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />

            {step === "verify" && (
              <Controller
                control={control}
                name="smsPassword"
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <label htmlFor="smsPassword" className="text-sm font-medium text-gray-700">
                      Нэг удаагийн нууц үг
                    </label>
                    <input
                      {...field}
                      id="smsPassword"
                      className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                        fieldState.error
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="SMS-ээр ирсэн кодыг оруулна уу"
                    />
                    {fieldState.error && (
                      <p className="text-sm text-red-600">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
            )}

            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                success 
                  ? "bg-green-50 text-green-700 border border-green-200" 
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {message}
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
                    Шинэчилж байна...
                  </div>
                ) : (
                  "Нууц үг солих"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AccountLayout>
  );
};

export default AccountPasswordScreen;
