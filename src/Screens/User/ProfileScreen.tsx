import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { userInfoAsync, userInfoUpdateAsyncNew } from "../../Redux/userActions";
import AccountLayout from "../../components/Layouts/account";
import { useNotification } from "../../Hooks/use-notification";
import { useHistoryNavigate } from "../../Hooks/use-navigate";
import { Button, Avatar, Card } from "antd";
import { EditOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import AddressList from "../../components/User/AddressList";

const AccountFormSchema = Yup.object().shape({
  name: Yup.string().required("Нэрээ заавал оруулна уу"),
  email: Yup.string().email("Зөв и-мэйл хаяг оруулна уу").optional(),
});

interface FormType {
  name: string;
  email?: string;
}

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.userInfo) ?? {};
  const { fullname, email } = data?.userProfile ?? {};
  const authState = useSelector((state: RootState) => state.auth);
  const { historyNavigate } = useHistoryNavigate();
  const { openNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authState?.isAuthenticated) {
      historyNavigate("/auth/login");
    }
  }, [authState?.isAuthenticated, historyNavigate]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    resolver: yupResolver(AccountFormSchema),
    defaultValues: { name: fullname || "", email: email || "" },
  });

  useEffect(() => {
    if (data?.userProfile) {
      reset({
        name: fullname || "",
        email: email && email !== "false" ? email : "",
      });
    }
  }, [data, fullname, email, reset]);

  const onSubmit = async (formData: FormType) => {
    setIsSubmitting(true);
    try {
      const result = await dispatch(
        userInfoUpdateAsyncNew({
          name: formData.name,
          email: formData.email || undefined,
        })
      );

      dispatch(userInfoAsync());
      openNotification({
        body: result.message ?? "Мэдээлэл амжилттай хадгалагдлаа! 🎉",
        type: "success",
      });
    } catch (error) {
      openNotification({
        body: (error as Error)?.message || "Алдаа гарлаа. Дахин оролдоно уу.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AccountLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-28 lg:pb-8">
        {/* Хэрэглэгчийн профайл header */}
        <Card className="overflow-hidden shadow-lg border-0 rounded-2xl">
          <div className="bg-gradient-to-br from-gray-900 to-gray-700 px-6 py-8 text-white">
            <div className="flex items-center gap-5">
              <Avatar
                size={80}
                icon={<UserOutlined />}
                className="bg-white/20 backdrop-blur-sm border-4 border-white/30"
              />
              <div>
                <h2 className="text-2xl text-white font-bold">
                  {fullname || "Хэрэглэгч"}
                </h2>
                <p className="text-white/80 flex items-center gap-2 mt-1">
                  <MailOutlined />
                  {email && email !== "false"
                    ? email
                    : "И-мэйл хаяг оруулаагүй"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Хувийн мэдээлэл засах */}
        <Card
          title={<span className="text-lg font-semibold">Хувийн мэдээлэл</span>}
          extra={<EditOutlined className="text-gray-500" />}
          className="shadow-lg border-0 rounded-2xl"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <UserOutlined className="text-gray-500" />
                Овог нэр
              </label>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <input
                    {...field}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-base transition-all bg-white
                      focus:outline-none focus:ring-4 focus:ring-gray-900/10 focus:border-gray-900
                      ${errors.name ? "border-red-400" : "border-gray-200"}`}
                    placeholder="Жишээ: Бат-Эрдэнэ"
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MailOutlined className="text-gray-500" />
                И-мэйл хаяг (заавал биш)
              </label>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-base bg-white
                      focus:outline-none focus:ring-4 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
                    placeholder="example@mail.mn"
                  />
                )}
              />
            </div>

            <Button
              type="primary"
              size="large"
              loading={isSubmitting}
              htmlType="submit"
              className="w-full h-12 text-base font-semibold bg-gray-900 hover:bg-black rounded-xl"
            >
              {isSubmitting ? "Хадгалж байна..." : "Хадгалах"}
            </Button>
          </form>
        </Card>

        {/* Хүргэлтийн хаягууд */}
        <AddressList />
      </div>
    </AccountLayout>
  );
};

export default ProfileScreen;
