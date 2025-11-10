import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { message, Checkbox } from "antd";
import { useState, useEffect, useRef } from "react";
import { Phone } from "lucide-react";

import locations from "../../lib/locations.json";
import HookFormProvider from "../../Providers/HookFormProvider";
import { LocationNType } from "../../types/Common";
import { shipmentLocations } from "../../lib/checkout";
import { HookFormInput, HookFormSelect } from "../HookFormInput";
import { ShippingAddress } from "../../types/Auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import {
  setUserFailure,
  setUserInfo,
  setUserRequest,
} from "../../Redux/slices/userInfoSlice";
import { useDrawerCtx } from "../../Hooks/use-modal-drawer";

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
  onSuccess?: () => void;
  onCancel?: () => void;
  editAddressData?: ShippingAddress;
}

const UserAddressForm: React.FC<Props> = ({ onCancel, editAddressData }) => {
  const { closeDrawer } = useDrawerCtx();

  const isEdit = !!editAddressData?.id;
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const prevCityIdRef = useRef<string>("");
  const prevDistrictIdRef = useRef<string>("");
  const typedLocations = locations as LocationNType;
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.userInfo) ?? {};
  const userProfileData = data?.userProfile;

  const { control, handleSubmit, watch, setValue, reset } = useForm<FormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      addressTitle: editAddressData?.addressTitle ?? "",
      addressDetail: editAddressData?.addressDetail ?? "",
      phone: editAddressData?.phone ?? "",
      cityId: editAddressData?.cityId ?? "",
      districtId: editAddressData?.districtId ?? "",
      baghorooId: editAddressData?.baghorooId ?? "",
      setAsDefault: editAddressData?.isDefault ?? false,
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
    // Component mount хийгдсэний дараа initialized болгох
    setIsInitialized(true);
  }, [isEdit, reset, editAddressData]);

  const [createAddress] = useMutation(CREATE_SHIPPING_ADDRESS);
  const [updateAddress] = useMutation(UPDATE_SHIPPING_ADDRESS);

  const cityIdValue = watch("cityId");
  const districtIdValue = watch("districtId");
  const computedLocations = shipmentLocations(cityIdValue, districtIdValue);

  // cityId өөрчлөгдөхөд districtId болон baghorooId-ийг reset хийх (зөвхөн хэрэглэгч өөрчлөх үед)
  useEffect(() => {
    // Эхний populate хийгдсэн ба cityId өөрчлөгдсөн бол
    if (isInitialized && prevCityIdRef.current !== cityIdValue) {
      setValue("districtId", "");
      setValue("baghorooId", "");
    }
    prevCityIdRef.current = cityIdValue;
  }, [cityIdValue, isInitialized, setValue]);

  // districtId өөрчлөгдөхөд baghorooId-ийг reset хийх (зөвхөн хэрэглэгч өөрчлөх үед)
  useEffect(() => {
    // Эхний populate хийгдсэн ба districtId өөрчлөгдсөн бол
    if (isInitialized && prevDistrictIdRef.current !== districtIdValue) {
      setValue("baghorooId", "");
    }
    prevDistrictIdRef.current = districtIdValue;
  }, [districtIdValue, isInitialized, setValue]);

  const onSubmit = async (formData: FormData) => {
    if (!userProfileData?.userId) {
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        dispatch(setUserRequest());
        const response = await updateAddress({
          variables: {
            addressId: editAddressData?.id,
            ...formData,
            cityId: formData.cityId || null,
            districtId: formData.districtId || null,
            baghorooId: formData.baghorooId || null,
            latitude: formData.latitude || null,
            longitude: formData.longitude || null,
            setAsDefault: formData.setAsDefault,
          },
        });

        const updatedAddress = response.data?.updateShippingAddress?.address;
        console.log({ updatedAddress });
        const newShippingAddresses = userProfileData?.shippingAddresses?.map(
          (addr) =>
            addr.id === editAddressData?.id ? { ...addr, ...formData } : addr
        );

        const updatedProfileData = {
          ...userProfileData,
          shippingAddresses: newShippingAddresses?.filter(
            (addr): addr is ShippingAddress => addr !== null
          ),
        };

        dispatch(setUserInfo({ userProfile: updatedProfileData }));

        message.success(
          response.data?.updateShippingAddress?.message ??
            "Хаяг амжилттай засагдлаа!"
        );
      } else {
        dispatch(setUserRequest());
        const response = await createAddress({
          variables: {
            ...formData,
            cityId: formData.cityId || null,
            districtId: formData.districtId || null,
            baghorooId: formData.baghorooId || null,
            latitude: formData.latitude || null,
            longitude: formData.longitude || null,
            setAsDefault: formData.setAsDefault,
          },
        });

        const createdDataResponse = response?.data?.createShippingAddress;
        const createdDataAddress = createdDataResponse?.address;
        const createdDataMessage = createdDataResponse?.message;
        const createdDataId = createdDataResponse?.address?.id;

        dispatch(
          setUserInfo({
            userProfile: {
              ...userProfileData,
              shippingAddresses: [
                ...(userProfileData?.shippingAddresses ?? []),
                {
                  id: createdDataId,
                  ...formData,
                  addressDetail: createdDataAddress?.addressDetail,
                },
              ],
            },
          })
        );
        message.success(createdDataMessage ?? "");
      }

      closeDrawer();

    } catch (err: unknown) {
      const errMsj = (err as Error)?.message || "Алдаа гарлаа";
      message.error(errMsj);
      dispatch(setUserFailure(errMsj));
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
      </div>
    </HookFormProvider>
  );
};

export default UserAddressForm;
