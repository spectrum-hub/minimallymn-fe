// components/forms/UserAddressForm.tsx
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { message } from "antd";
import { useState } from "react";
import { Phone } from "lucide-react";
import { HookFormInput, HookFormSelect } from "../HookFormInput";
import locations from "../../lib/locations.json";
import HookFormProvider from "../../Providers/HookFormProvider";
import { LocationNType } from "../../types/Common";
import { shipmentLocations } from "../../lib/checkout";
const formSchema = Yup.object().shape({
  addressDetail: Yup.string()
    .required("Гудамж, байр, орц, давхар оруулна уу")
    .min(5, "Хэт богино хаяг"),
  addressTitle: Yup.string()
    .required("Хаягын нэр оруулна уу")
    .min(2, "Нэр хэт богино"),
  phone: Yup.string()
    .matches(/^\+?[976]\d{7,11}$/, "Утасны дугаар буруу байна")
    .required("Утасны дугаар оруулна уу"),
  districtId: Yup.string().required("Дүүрэг хороо сонгоно уу"),
  cityId: Yup.string().required("Хот, аймаг сонгоно уу"),
  baghorooId: Yup.string().required("Хороо, баг сонгоно уу"),
});

const CREATE_SHIPPING_ADDRESS = gql`
  mutation CreateShippingAddress(
    $addressDetail: String!
    $addressTitle: String!
    $phone: String!
    $cityId: String!
    $districtId: String!
    $baghorooId: String!
    $setAsDefault: Boolean
  ) {
    createShippingAddress(
      addressDetail: $addressDetail
      addressTitle: $addressTitle
      phone: $phone
      cityId: $cityId
      districtId: $districtId
      baghorooId: $baghorooId
      setAsDefault: $setAsDefault
    ) {
      address {
        id
        phone
        addressDetail
        addressTitle
      }
      success
      message
    }
  }
`;

interface FormSubmit {
  addressDetail: string;
  addressTitle: string;
  phone: string;
  cityId: string;
  districtId: string;
  baghorooId: string;
}

const UserAddressForm: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const typedLocations = locations as LocationNType;

  const [loading, setLoading] = useState(false);
  const [createAddress] = useMutation(CREATE_SHIPPING_ADDRESS, {
    onCompleted: (data) => {
      if (data.createShippingAddress.success) {
        message.success(
          data.createShippingAddress.message || "Хаяг амжилттай нэмэгдлээ!"
        );
        onSuccess?.();
      } else {
        message.error(data.createShippingAddress.message || "Алдаа гарлаа");
      }
    },
    onError: (err) => {
      message.error("Серверт алдаа гарлаа: " + err.message);
    },
    refetchQueries: ["userProfile"], // Профайл дахин ачаална
  });

  const { control, handleSubmit, watch } = useForm<FormSubmit>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      addressTitle: "",
      addressDetail: "",
      phone: "",
      districtId: "",
      baghorooId: "",
      cityId: "",
    },
  });

  const cityIdValue = watch("cityId");
  const computedShipmentLocations = shipmentLocations(
    cityIdValue,
    watch("districtId")
  );

  const onSubmit = async (data: FormSubmit) => {
    setLoading(true);
    try {
      await createAddress({
        variables: {
          ...data,
          setAsDefault: true, // эсвэл checkbox нэмж болно
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <HookFormProvider
      loading={loading}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
    >
      <HookFormInput<FormSubmit>
        control={control}
        name="addressTitle"
        label="Хаягын авагчийн нэр"
        placeholder="Овог нэрээ бүрэн бичнэ үү"
        prefixIcon={undefined}
        isMobile={false}
      />
      <HookFormSelect
        control={control}
        options={Object.values(typedLocations)}
        name={"cityId"}
        label="Хот/Аймаг"
      />
      {cityIdValue && (
        <HookFormSelect
          control={control}
          options={computedShipmentLocations?.districts}
          name={"districtId"}
          label="Дүүрэг/Сум"
        />
      )}
      {watch("districtId") && (
        <HookFormSelect
          control={control}
          options={computedShipmentLocations?.baghoroo || []}
          name={"baghorooId"}
          label="Хороо/Баг"
        />
      )}

      <HookFormInput<FormSubmit>
        control={control}
        name="phone"
        label="Утасны дугаар"
        placeholder="+97699123456"
        prefixIcon={Phone}
        inputProps={{ maxLength: 15 }}
      />

      <HookFormInput<FormSubmit>
        control={control}
        name="addressDetail"
        label="Дэлгэрэнгүй хаяг"
        placeholder="Бараа хүлээн авах дэлгэрэнгүй хаяг"
      />
    </HookFormProvider>
  );
};

export default UserAddressForm;
