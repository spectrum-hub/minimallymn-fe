// components/forms/UserAddressForm.tsx
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { message, Checkbox } from "antd";
import { useState, useEffect } from "react";
import { Phone } from "lucide-react";

import locations from "../../lib/locations.json";
import HookFormProvider from "../../Providers/HookFormProvider";
import { LocationNType } from "../../types/Common";
import { shipmentLocations } from "../../lib/checkout";
import { HookFormInput, HookFormSelect } from "../HookFormInput";
import { ShippingAddress } from "../../types/Auth";

const formSchema = Yup.object().shape({
  addressTitle: Yup.string()
    .required("Хаягын нэр оруулна уу")
    .min(2, "Хэт богино"),
  addressDetail: Yup.string()
    .required("Дэлгэрэнгүй хаяг оруулна уу")
    .min(5, "Хэт богино"),
  phone: Yup.string()
    .required("Утас оруулна уу")
    .test("phone", "Зөвхөн тоо, 8 эсвэл 11 орон", (v) => {
      if (!v) return false;
      const num = v.replace(/[^\d]/g, "");
      return num.length === 8 || (num.startsWith("976") && num.length === 11);
    }),
  cityId: Yup.string().required("Хот/Аймаг сонгоно уу"),
  districtId: Yup.string().required("Дүүрэг/Сум сонгоно уу"),
  baghorooId: Yup.string().required("Хороо/Баг сонгоно уу"),
});

// ==================== MUTATIONS ====================
const CREATE_SHIPPING_ADDRESS = gql`
  mutation CreateShippingAddress(
    $addressTitle: String!
    $addressDetail: String!
    $phone: String!
    $cityId: String
    $districtId: String
    $baghorooId: String
    $latitude: String
    $longitude: String
    $setAsDefault: Boolean
  ) {
    createShippingAddress(
      addressTitle: $addressTitle
      addressDetail: $addressDetail
      phone: $phone
      cityId: $cityId
      districtId: $districtId
      baghorooId: $baghorooId
      latitude: $latitude
      longitude: $longitude
      setAsDefault: $setAsDefault
    ) {
      success
      message
      address {
        id
        addressTitle
        addressDetail
        phone
        isDefault
      }
    }
  }
`;

const UPDATE_SHIPPING_ADDRESS = gql`
  mutation UpdateShippingAddress(
    $addressId: Int!
    $addressTitle: String
    $addressDetail: String
    $phone: String
    $cityId: String
    $districtId: String
    $baghorooId: String
    $latitude: String
    $longitude: String
    $setAsDefault: Boolean
  ) {
    updateShippingAddress(
      addressId: $addressId
      addressTitle: $addressTitle
      addressDetail: $addressDetail
      phone: $phone
      cityId: $cityId
      districtId: $districtId
      baghorooId: $baghorooId
      latitude: $latitude
      longitude: $longitude
      setAsDefault: $setAsDefault
    ) {
      success
      message
      address {
        id
        addressTitle
        addressDetail
        phone
        isDefault
      }
    }
  }
`;

interface FormData {
  addressTitle: string;
  addressDetail: string;
  phone: string;
  cityId: string;
  districtId: string;
  baghorooId: string;
  latitude?: string;
  longitude?: string;
  setAsDefault?: boolean;
}

interface Props {
  addressId?: number; // Хэрвээ байвал → Edit, байхгүй бол → Create
  onSuccess?: () => void;
  onCancel?: () => void;
  editAddressData?: ShippingAddress;
}

const UserAddressForm: React.FC<Props> = ({
  addressId,
  onSuccess,
  onCancel,
  editAddressData,
}) => {
  const isEdit = !!addressId;
  const [loading, setLoading] = useState(false);
  const typedLocations = locations as LocationNType;

  const { control, handleSubmit, watch, setValue, reset } = useForm<FormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      addressTitle: "",
      addressDetail: "",
      phone: "",
      cityId: "",
      districtId: "",
      baghorooId: "",
      setAsDefault: false,
    },
  });

  useEffect(() => {
    if (isEdit && editAddressData) {
      reset({
        addressTitle: editAddressData.addressTitle || "",
        addressDetail: editAddressData.addressDetail || "",
        phone: editAddressData.phone || "",
        cityId: editAddressData.cityId || "",
        districtId: editAddressData.districtId || "",
        baghorooId: editAddressData.baghorooId || "",
        latitude: editAddressData.latitude || "",
        longitude: editAddressData.longitude || "",
        setAsDefault: editAddressData.isDefault || false,
      });
    }
  }, [isEdit, addressId, reset, editAddressData]);

  const [createAddress] = useMutation(CREATE_SHIPPING_ADDRESS);
  const [updateAddress] = useMutation(UPDATE_SHIPPING_ADDRESS);

  const cityIdValue = watch("cityId");
  const districtIdValue = watch("districtId");
  const computedLocations = shipmentLocations(cityIdValue, districtIdValue);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (isEdit) {
        await updateAddress({
          variables: {
            addressId,
            ...data,
            cityId: data.cityId || null,
            districtId: data.districtId || null,
            baghorooId: data.baghorooId || null,
          },
        });
        message.success("Хаяг амжилттай засагдлаа!");
      } else {
        await createAddress({
          variables: {
            ...data,
            cityId: data.cityId || null,
            districtId: data.districtId || null,
            baghorooId: data.baghorooId || null,
          },
        });
        message.success("Хаяг амжилттай нэмэгдлээ!");
      }
      onSuccess?.();
    } catch (err: unknown) {
      message.error((err as Error)?.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <HookFormProvider
      loading={loading}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitText={isEdit ? "Хадгалах" : "Нэмэх"}
    >
      <div className="space-y-4">
        <HookFormInput
          control={control}
          name="addressTitle"
          label="Хаягын нэр"
          placeholder="Гэр, Ажил гэх мэт"
        />

        <HookFormSelect
          control={control}
          name="cityId"
          label="Хот / Аймаг"
          options={Object.values(typedLocations)}
          placeholder="Сонгоно уу"
        />

        {cityIdValue && (
          <HookFormSelect
            control={control}
            name="districtId"
            label="Дүүрэг / Сум"
            options={computedLocations?.districts || []}
            placeholder="Сонгоно уу"
          />
        )}

        {districtIdValue && (
          <HookFormSelect
            control={control}
            name="baghorooId"
            label="Хороо / Баг"
            options={computedLocations?.baghoroo || []}
            placeholder="Сонгоно уу"
          />
        )}

        <HookFormInput
          control={control}
          name="phone"
          label="Утасны дугаар"
          placeholder="88123456"
          prefixIcon={Phone}
          inputProps={{ maxLength: 15 }}
        />

        <HookFormInput
          control={control}
          name="addressDetail"
          label="Дэлгэрэнгүй хаяг"
          placeholder="Байр, орц, тоот, давхар"
          type="textarea"
          textareaRows={3}
        />

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={watch("setAsDefault")}
            onChange={(e) => setValue("setAsDefault", e.target.checked)}
          />
          <label className="text-sm text-gray-700">
            Үндсэн хүргэлтийн хаяг болгох
          </label>
        </div>
      </div>
    </HookFormProvider>
  );
};

export default UserAddressForm;
