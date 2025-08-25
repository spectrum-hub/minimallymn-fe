/**
 *
 *  AccountPasswordScreen.tsx is a React component that
 *  allows users to update their login password.
 *
 */

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Button, Form, Input } from "antd";
import AccountLayout from "../../components/Layouts/account";
import { useNotification } from "../../Hooks/use-notification";
import styles from "./user.module.css";
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
  smsPassword: Yup.string().when("step", {
    is: (val: string) => val === "verify",
    then: (schema) => schema.required("Заавал бөглөх"),
    otherwise: (schema) => schema,
  }),
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
      <UserInfoTab />
      <form onSubmit={handleSubmit(onSubmit)} className={styles.itemContainer}>
        <h2 className={styles.title}>Нэвтрэх нууц үг шинэчлэх</h2>
        <Controller
          control={control}
          name={"newPassword"}
          render={({ field, fieldState }) => (
            <Form.Item
              label="Шинэ нууц үг"
              layout="vertical"
              help={fieldState.error?.message}
              validateStatus={fieldState.error ? "error" : ""}
            >
              <Input {...field} placeholder="" className="w-full" />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name={"newPasswordRepeat"}
          render={({ field, fieldState }) => (
            <Form.Item
              label="Шинэ нууц үг давтах"
              layout="vertical"
              help={fieldState.error?.message}
              validateStatus={fieldState.error ? "error" : ""}
            >
              <Input {...field} placeholder="" className="w-full" />
            </Form.Item>
          )}
        />

        {step === "verify" && (
          <Controller
            control={control}
            name="smsPassword"
            render={({ field, fieldState }) => (
              <Form.Item
                label="Нэг удаагийн нууц үг"
                layout="vertical"
                help={fieldState.error?.message}
                validateStatus={fieldState.error ? "error" : ""}
              >
                <Input {...field} placeholder="" className="w-full" />
              </Form.Item>
            )}
          />
        )}

        <span
          className={`text-sm mt-6 font-bold block ${
            success ? "text-green-500" : "text-red-600"
          }`}
        >
          {message}
        </span>

        <Button
          size="large"
          htmlType="submit"
          type="primary"
          loading={loading || isSubmitting}
          className="w-full max-w-xs"
        >
          Нууц үг солих
        </Button>
      </form>
    </AccountLayout>
  );
};

export default AccountPasswordScreen;
