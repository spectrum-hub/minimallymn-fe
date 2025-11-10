import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import AccountLayout from "../../components/Layouts/account";
import { useNotification } from "../../Hooks/use-notification";
import { useHistoryNavigate } from "../../Hooks/use-navigate";
import { Button, Avatar, Card, Input } from "antd";
import { EditOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import AddressList from "../../components/User/AddressList";
import { getUserProfile } from "../../Redux/userActions";
import { setUserRequest } from "../../Redux/slices/userInfoSlice";
import { gql, useMutation } from "@apollo/client";

const UpdateFullNameMutate = gql`
  mutation updateUserNameEmail($fullname: String) {
    updateUserNameEmail(fullname: $fullname) {
      userId
      success
      message
    }
  }
`;
const UpdateEmailMutate = gql`
  mutation updateUserNameEmail($email: String) {
    updateUserNameEmail(email: $email) {
      userId
      success
      message
    }
  }
`;

const AccountFormEmailSchema = Yup.object().shape({
  email: Yup.string().email("Зөв и-мэйл хаяг оруулна уу").required(),
});
const AccountFormFullNameSchema = Yup.object().shape({
  fullname: Yup.string()
    .required("Нэрээ заавал оруулна уу")
    .min(2, "Хэт богино"),
});

interface FormTypeFullname {
  fullname: string;
}
interface FormTypeEmail {
  email: string;
}

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.userInfo) ?? {};
  const userProfileData = data?.userProfile;
  const { fullname, email } = data?.userProfile ?? {};

  const [updateFullname] = useMutation(UpdateFullNameMutate);
  const [updateEmail] = useMutation(UpdateEmailMutate);

  const authState = useSelector((state: RootState) => state.auth);
  const { historyNavigate } = useHistoryNavigate();
  const { openNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authState?.isAuthenticated) {
      historyNavigate("/auth/login");
    }
  }, [authState?.isAuthenticated, historyNavigate]);

  const emailUpdateForm = useForm<FormTypeEmail>({
    resolver: yupResolver(AccountFormEmailSchema),
    defaultValues: { email: email || "" },
  });

  const fullnameUpdateForm = useForm<FormTypeFullname>({
    resolver: yupResolver(AccountFormFullNameSchema),
    defaultValues: { fullname: fullname || "" },
  });

  useEffect(() => {
    if (data?.userProfile) {
      emailUpdateForm.reset({
        email: email && email !== "false" ? email : "",
      });
    }
  }, [data?.userProfile, email, emailUpdateForm]);

  useEffect(() => {
    if (data?.userProfile) {
      fullnameUpdateForm.reset({
        fullname: fullname || "",
      });
    }
  }, [data?.userProfile, fullname, fullnameUpdateForm]);

  const onSubmitEmail = async (formData: FormTypeEmail) => {
    if (!userProfileData?.userId) {
      return;
    }
    setIsSubmitting(true);
    try {
      dispatch(setUserRequest());
      const response = await updateEmail({
        variables: {
          email: formData?.email,
        },
      });
      openNotification({
        body:
          response?.data?.updateUserNameEmail?.message ??
          "Мэдээлэл амжилттай хадгалагдлаа! 🎉",
        type: "success",
      });
      dispatch(getUserProfile());
    } catch (error) {
      openNotification({
        body: (error as Error)?.message || "Алдаа гарлаа. Дахин оролдоно уу.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitFullname = async (formData: FormTypeFullname) => {
    if (!userProfileData?.userId) {
      return;
    }
    setIsSubmitting(true);
    try {
      dispatch(setUserRequest());
      const response = await updateFullname({
        variables: {
          fullname: formData?.fullname,
        },
      });
      openNotification({
        body:
          response?.data?.updateUserNameEmail?.message ??
          "Мэдээлэл амжилттай хадгалагдлаа! 🎉",
        type: "success",
      });
      dispatch(getUserProfile());
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
                  {data?.userProfile?.phone}
                </h2>
                <p className="text-white/80 flex items-center gap-2 mt-1">
                  <MailOutlined />
                  {email && email !== "false" ? email : ""}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Хувийн мэдээлэл засах */}
        <Card
          title={<span className="text-lg font-semibold">Хувийн мэдээлэл</span>}
          extra={<EditOutlined className="text-gray-500" />}
          className="shadow-lg border-0 rounded-2xl "
        >
          <form onSubmit={fullnameUpdateForm.handleSubmit(onSubmitFullname)}>
            <label htmlFor="fullname">Овог нэр</label>
            <div className="flex flex-row justify-center items-center gap-0 max-w-xl ">
              <Controller
                control={fullnameUpdateForm.control}
                name="fullname"
                render={({ field }) => (
                  <Input
                    {...field}
                    prefix={<UserOutlined className="text-gray-500" />}
                    placeholder="Таны нэр"
                    className="rounded-r-none"
                  />
                )}
              />
              <Button
                type="primary"
                size="small"
                loading={isSubmitting}
                htmlType="submit"
                style={{
                  height: 32,
                }}
                className="rounded-l-none"
              >
                {isSubmitting ? "Хадгалж байна..." : "Хадгалах"}
              </Button>
            </div>
          </form>

          <br />

          <form onSubmit={emailUpdateForm.handleSubmit(onSubmitEmail)}>
            <label htmlFor="email">Имэйл хаяг</label>
            <div className="flex flex-row justify-center items-center gap-0 max-w-xl ">
              <Controller
                control={emailUpdateForm.control}
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="example@mail.mn"
                    prefix={<UserOutlined className="text-gray-500" />}
                    className="rounded-r-none"
                  />
                )}
              />
              <Button
                type="primary"
                size="small"
                loading={isSubmitting}
                htmlType="submit"
                style={{
                  height: 32,
                }}
                className="rounded-l-none"
              >
                {isSubmitting ? "Хадгалж байна..." : "Хадгалах"}
              </Button>
            </div>
          </form>
        </Card>

        <AddressList />
      </div>
    </AccountLayout>
  );
};

export default ProfileScreen;
