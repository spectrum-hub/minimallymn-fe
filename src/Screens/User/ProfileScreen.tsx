import React, { useCallback, useEffect, useMemo, useState } from "react";
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

// Single mutation that can update email and/or fullname (server must support optional args)
const UPDATE_USER = gql`
  mutation updateUser($fullname: String, $email: String) {
    updateUserNameEmail(fullname: $fullname, email: $email) {
      userId
      success
      message
    }
  }
`;

const FullnameSchema = Yup.object({
  fullname: Yup.string()
    .required("Нэрээ заавал оруулна уу")
    .min(2, "Хэт богино"),
});

const EmailSchema = Yup.object({
  email: Yup.string()
    .email("Зөв и-мэйл хаяг оруулна уу")
    .required("Имэйл заавал оруулна уу"),
});

type FullnameForm = { fullname: string };
type EmailForm = { email: string };

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((s: RootState) => s.userInfo) ?? {};
  const authState = useSelector((s: RootState) => s.auth);

  const userProfile = data?.userProfile;
  const initialFullname = userProfile?.fullname ?? "";
  const initialEmail =
    userProfile?.email && userProfile.email !== "false"
      ? userProfile.email
      : "";

  const { historyNavigate } = useHistoryNavigate();
  const { openNotification } = useNotification();

  // Local loading state per form so updating name doesn't block updating email
  const [loadingFullname, setLoadingFullname] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);

  const [updateUser] = useMutation(UPDATE_USER);

  useEffect(() => {
    if (!authState?.isAuthenticated) {
      historyNavigate("/auth/login");
    }
  }, [authState?.isAuthenticated, historyNavigate]);

  const fullnameForm = useForm<FullnameForm>({
    resolver: yupResolver(FullnameSchema),
    defaultValues: useMemo(
      () => ({ fullname: initialFullname }),
      [initialFullname]
    ),
  });

  const emailForm = useForm<EmailForm>({
    resolver: yupResolver(EmailSchema),
    defaultValues: useMemo(() => ({ email: initialEmail }), [initialEmail]),
  });

  // reset forms when profile data changes
  useEffect(() => {
    fullnameForm.reset({ fullname: initialFullname });
    emailForm.reset({ email: initialEmail });
  }, [emailForm, fullnameForm, initialEmail, initialFullname]);

  const handleResponse = (res: any) => {
    const msg = res?.data?.updateUserNameEmail?.message;
    if (msg) {
      openNotification({ body: msg, type: "success" });
    } else {
      openNotification({
        body: "Мэдээлэл амжилттай хадгалагдлаа! 🎉",
        type: "success",
      });
    }
    // refresh profile after successful update
    dispatch(getUserProfile());
  };

  const handleError = (err: unknown) => {
    openNotification({
      body: (err as Error)?.message || "Алдаа гарлаа. Дахин оролдоно уу.",
      type: "error",
    });
  };

  const onSubmitFullname = useCallback(
    async (values: FullnameForm) => {
      if (!userProfile?.userId) return;
      setLoadingFullname(true);
      try {
        dispatch(setUserRequest());
        const res = await updateUser({
          variables: { fullname: values.fullname },
        });
        handleResponse(res);
      } catch (err) {
        handleError(err);
      } finally {
        setLoadingFullname(false);
      }
    },
    [dispatch, handleError, handleResponse, updateUser, userProfile?.userId]
  );

  const onSubmitEmail = useCallback(
    async (values: EmailForm) => {
      if (!userProfile?.userId) return;
      setLoadingEmail(true);
      try {
        dispatch(setUserRequest());
        const res = await updateUser({ variables: { email: values.email } });
        handleResponse(res);
      } catch (err) {
        handleError(err);
      } finally {
        setLoadingEmail(false);
      }
    },
    [dispatch, handleError, handleResponse, updateUser, userProfile?.userId]
  );

  return (
    <AccountLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-28 lg:pb-8">
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
                  {userProfile?.phone ?? ""}
                </h2>
                <p className="text-white/80 flex items-center gap-2 mt-1">
                  <MailOutlined /> {initialEmail}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card
          title={<span className="text-lg font-semibold">Хувийн мэдээлэл</span>}
          extra={<EditOutlined className="text-gray-500" />}
          className="shadow-lg border-0 rounded-2xl "
        >
          <form onSubmit={fullnameForm.handleSubmit(onSubmitFullname)}>
            <label htmlFor="fullname">Овог нэр</label>
            <div className="flex flex-row justify-center items-center gap-0 max-w-xl ">
              <Controller
                control={fullnameForm.control}
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
                loading={loadingFullname}
                htmlType="submit"
                style={{ height: 32 }}
                className="rounded-l-none"
              >
                {loadingFullname ? "Хадгалж байна..." : "Хадгалах"}
              </Button>
            </div>
            {fullnameForm.formState.errors.fullname && (
              <p className="text-sm text-red-500 mt-2">
                {fullnameForm.formState.errors.fullname.message}
              </p>
            )}
          </form>

          <br />

          <form onSubmit={emailForm.handleSubmit(onSubmitEmail)}>
            <label htmlFor="email">Имэйл хаяг</label>
            <div className="flex flex-row justify-center items-center gap-0 max-w-xl ">
              <Controller
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="example@mail.mn"
                    prefix={<MailOutlined className="text-gray-500" />}
                    className="rounded-r-none"
                  />
                )}
              />
              <Button
                type="primary"
                size="small"
                loading={loadingEmail}
                htmlType="submit"
                style={{ height: 32 }}
                className="rounded-l-none"
              >
                {loadingEmail ? "Хадгалж байна..." : "Хадгалах"}
              </Button>
            </div>
            {emailForm.formState.errors.email && (
              <p className="text-sm text-red-500 mt-2">
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </form>
        </Card>

        <AddressList />
      </div>
    </AccountLayout>
  );
};

export default ProfileScreen;
