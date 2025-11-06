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
import { Button, Avatar, Card, List, Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDrawerCtx } from "../../Hooks/use-modal-drawer";
import UserAddressForm from "../../components/User/UserAddressForm";

const AccountFormSchema = Yup.object().shape({
  name: Yup.string().required("Нэрээ заавал оруулна уу"),
  email: Yup.string().email("Зөв и-мэйл хаяг оруулна уу").optional(),
});

interface FormType {
  name: string;
  email?: string;
}

const ProfileScreen: React.FC = () => {
  const { setLoading, showDrawer } = useDrawerCtx();

  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } =
    useSelector((state: RootState) => state.userInfo) ?? {};
  const { street, name, email } = data?.userInfo?.pdata ?? {};
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
    defaultValues: { name: name || "", email: email || "" },
  });

  useEffect(() => {
    if (data?.userInfo?.pdata) {
      reset({
        name: name || "",
        email: email && email !== "false" ? email : "",
      });
    }
  }, [data, name, email, reset]);

  const handleOpenDrawer = () => {
    setLoading(true);
    showDrawer({
      title: "Хайлт",
      placement: "right",
      content: <UserAddressForm />,
      width: "400px",
    });
    setLoading(false);
  };

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

  // Dummy хаягууд (та өөрийн датагаар солино)
  const deliveryAddresses = [
    {
      id: 1,
      title: "Гэр",
      address: "БЗД, 26-р хороо, Амгалан, 12-р байр 34 тоот",
      isDefault: true,
    },
    {
      id: 2,
      title: "Ажлын газар",
      address: "СБД, 1-р хороо, Централ тауэр, 12 давхар",
    },
    { id: 3, title: "Хөдөө", address: "Дорнод аймаг, Чойбалсан, 5-р баг" },
  ];

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
                  {name || "Хэрэглэгч"}
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
        <Card
          title={
            <span className="text-lg font-semibold">
              Миний хаягууд ({deliveryAddresses.length})
            </span>
          }
          className="shadow-lg border-0 rounded-2xl"
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="bg-green-600 hover:bg-green-700 border-0 rounded-xl font-medium"
              onClick={() => handleOpenDrawer()}
            >
              Хаяг нэмэх
            </Button>
          }
        >
          <List
            itemLayout="horizontal"
            dataSource={deliveryAddresses}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    className="text-blue-600"
                    key={1}
                  >
                    Засах
                  </Button>,
                  <Button type="text" danger icon={<DeleteOutlined />} key={2}>
                    Устгах
                  </Button>,
                ]}
                className="hover:bg-gray-50 rounded-xl px-2 -mx-2 transition-all"
              >
                <List.Item.Meta
                  title={
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{item.title}</span>
                      {item.isDefault && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                          Үндсэн
                        </span>
                      )}
                    </div>
                  }
                  description={
                    <span className="text-gray-600">{item.address}</span>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </AccountLayout>
  );
};

export default ProfileScreen;
