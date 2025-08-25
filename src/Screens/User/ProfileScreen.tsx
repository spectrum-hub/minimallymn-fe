import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Button, Form, Input } from "antd";

import { userInfoAsync, userInfoUpdateAsyncNew } from "../../Redux/userActions";
import AccountLayout from "../../components/Layouts/account";
import { useNotification } from "../../Hooks/use-notification";

import styles from "./user.module.css";
import UserInfoTab from "../../components/User/UserInfoSelectTab";
import { useHistoryNavigate } from "../../Hooks/use-navigate";

const AccountFormSchema = Yup.object().shape({
  // city_id: Yup.string().optional(),
  // district_id: Yup.string().optional(),
  // baghoroo_id: Yup.string().optional(),
  // street: Yup.string().optional(),
  name: Yup.string().required("Заавал бөглөх"),
});

// const locationsTyped: LocationNType = locations;

interface FormType {
  name: string;
  // city_id?: string;
  // district_id?: string;
  // baghoroo_id?: string;
  // street?: string;
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
      // city_id: "",
      // district_id: "",
      // baghoroo_id: "",
      // street: street,
      name: name,
      email: email,
    },
  });

  // const selectedCityId = watch("city_id");
  // const selectedDistrictId = watch("district_id");

  // Анхны утгуудыг тавих
  useEffect(() => {
    if (data?.userInfo?.userData) {
      // const { city_id, district_id, baghoroo_id } = data.userInfo.userData;
      reset({
        // city_id: city_id ?? "",
        // district_id: district_id ?? "",
        // baghoroo_id: baghoroo_id ?? "",
        // street,
        name,
        email: email,
      });

      // Хэрэв утгууд тухайн сонголтод байхгүй бол хоослох
      // if (
      //   city_id &&
      //   district_id &&
      //   !locationsTyped[city_id]?.sumDuureg[district_id]
      // ) {
      //   setValue("district_id", "");
      //   setValue("baghoroo_id", "");
      // } else if (
      //   city_id &&
      //   district_id &&
      //   baghoroo_id &&
      //   !locationsTyped[city_id]?.sumDuureg[district_id]?.baghoroo[baghoroo_id]
      // ) {
      //   setValue("baghoroo_id", "");
      // }
    }
  }, [data, email, name, reset, setValue, street]);

  // City өөрчлөгдөхөд district болон baghoroo-г хоослох
  // useEffect(() => {
  //   if (
  //     selectedCityId &&
  //     !locationsTyped[selectedCityId]?.sumDuureg[selectedDistrictId]
  //   ) {
  //     setValue("district_id", "");
  //     setValue("baghoroo_id", "");
  //   }
  // }, [selectedCityId, selectedDistrictId, setValue]);

  // District өөрчлөгдөхөд baghoroo-г хоослох
  // useEffect(() => {
  //   if (
  //     selectedCityId &&
  //     selectedDistrictId &&
  //     !locationsTyped[selectedCityId]?.sumDuureg[selectedDistrictId]?.baghoroo[
  //       watch("baghoroo_id")
  //     ]
  //   ) {
  //     setValue("baghoroo_id", "");
  //   }
  // }, [selectedDistrictId, selectedCityId, setValue, watch]);

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
      <UserInfoTab />
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-2">
        <div className={styles.itemContainer}>
          <h2 className={styles.title}> Хувийн мэдээлэл</h2>

          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Form.Item
                label="Харилцагчийн овог, нэр"
                layout="vertical"
                help={fieldState.error?.message}
                validateStatus={fieldState.error ? "error" : ""}
                htmlFor="name"
              >
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  id="name"
                  className="w-full"
                  placeholder="Овог, Нэрээ оруулна уу"
                />
              </Form.Item>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Form.Item
                label="И-Мэйл хаяг"
                layout="vertical"
                help={fieldState.error?.message}
                validateStatus={fieldState.error ? "error" : ""}
                htmlFor="email"
                required
              >
                <Input
                  value={
                    String(field.value) === "false" ? "" : String(field.value)
                  }
                  required
                  onChange={field.onChange}
                  id="email"
                  className="w-full"
                  placeholder="Харилцах э-мэйл хаягаа оруулан уу"
                />
              </Form.Item>
            )}
          />
        </div>

        {/* <div className={styles.itemContainer}>
          <h2 className={styles.title}>Хүргэлтийн хаяг</h2>
          <div className={styles.itemsGrid}>
            <Controller
              control={control}
              name="city_id"
              render={({ field, fieldState }) => (
                <PSelect<FormType>
                  field={field}
                  fieldState={fieldState}
                  label="Хот/Аймаг"
                  htmlFor="city"
                  options={Object.entries(locationsTyped).map(
                    ([key, value]) => ({
                      label: value.label,
                      value: key,
                    })
                  )}
                  onChange={() => {
                    setValue("district_id", "");
                    setValue("baghoroo_id", "");
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="district_id"
              render={({ field, fieldState }) => (
                <PSelect<FormType>
                  field={field}
                  fieldState={fieldState}
                  label="Дүүрэг / Сум"
                  htmlFor="district"
                  disabled={!selectedCityId}
                  options={
                    selectedCityId
                      ? Object.entries(
                          locationsTyped[selectedCityId]?.sumDuureg || {}
                        ).map(([key, value]) => ({
                          label: value.label,
                          value: key,
                        }))
                      : []
                  }
                  onChange={() => setValue("baghoroo_id", "")}
                />
              )}
            />

            <Controller
              control={control}
              name="baghoroo_id"
              render={({ field, fieldState }) => (
                <PSelect<FormType>
                  field={field}
                  fieldState={fieldState}
                  label="Баг / Хороо"
                  htmlFor="baghoroo"
                  disabled={!selectedDistrictId}
                  options={
                    selectedCityId && selectedDistrictId
                      ? Object.entries(
                          locationsTyped[selectedCityId]?.sumDuureg[
                            selectedDistrictId
                          ]?.baghoroo || {}
                        ).map(([key, value]) => ({
                          label: value.label,
                          value: key,
                        }))
                      : []
                  }
                />
              )}
            />
          </div>

          <Controller
            control={control}
            name="street"
            render={({ field, fieldState }) => (
              <Form.Item
                label="Дэлгэрэнгүй хаяг"
                layout="vertical"
                help={fieldState.error?.message}
                validateStatus={fieldState.error ? "error" : ""}
                htmlFor="street"
                style={{ marginTop: 0 }}
              >
                <Input.TextArea
                  value={
                    String(field.value) === "false" ? "" : String(field.value)
                  }
                  onChange={field.onChange}
                  id="street"
                  className="w-full"
                  rows={4}
                  placeholder="Хаягаа оруулна уу"
                />
              </Form.Item>
            )}
          />
        </div> */}

        <div className="p-1 max-w-3xl flex justify-end">
          <Button
            size="large"
            htmlType="submit"
            type="primary"
            loading={loading || isSubmitting}
            className="w-full max-w-xs"
          >
            Мэдээлэл хадгалах
          </Button>
        </div>
      </form>
    </AccountLayout>
  );
};

export default ProfileScreen;
