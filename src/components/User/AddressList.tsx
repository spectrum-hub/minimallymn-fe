import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { gql, useMutation } from "@apollo/client";
import { useNotification } from "../../Hooks/use-notification";
import { Button, Card, List, Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useDrawerCtx } from "../../Hooks/use-modal-drawer";
import UserAddressForm from "../../components/User/UserAddressForm";
import { ShippingAddress } from "../../types/Auth";
import { getLocationData } from "../../utils/location";
import { setUserInfo, setUserRequest } from "../../Redux/slices/userInfoSlice";
import { Circle, CircleCheckBig } from "lucide-react";

const DELETE_SHIPPING_ADDRESS = gql`
  mutation DeleteShippingAddress($addressId: Int!) {
    deleteShippingAddress(addressId: $addressId) {
      success
      message
    }
  }
`;

interface Props {
  isCheckout?: boolean;
  setSelectedAddress?: (arg: string) => void;
}
const AddressList: React.FC<Props> = ({
  setSelectedAddress,
  isCheckout = false,
}) => {
  const { showDrawer, closeDrawer, setLoading } = useDrawerCtx();

  const [selectedAddressId, setSelectedAddressId] = useState<number>();

  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } =
    useSelector((state: RootState) => state.userInfo) ?? {};
  const { shippingAddresses, shippingAddressesConfig } =
    data?.userProfile ?? {};

  const { addText, editText, title } = shippingAddressesConfig ?? {};
  const { openNotification } = useNotification();
  // Local state for optimistic UI
  const [localAddresses, setLocalAddresses] = useState(shippingAddresses || []);

  const userProfileData = data?.userProfile;

  // Sync local state with Redux state
  useEffect(() => {
    if (shippingAddresses) {
      setLocalAddresses(shippingAddresses);
    }
  }, [shippingAddresses]);

  const [deleteAddress, { loading: deleteLoading }] = useMutation(
    DELETE_SHIPPING_ADDRESS,
    {
      onCompleted: (data) => {
        if (data.deleteShippingAddress.success) {
          openNotification({
            body: data.deleteShippingAddress.message,
            type: "success",
          });
        } else {
          openNotification({
            body: data.deleteShippingAddress.message,
            type: "error",
          });
          // Алдаа гарвал буцаан сэргээх
          setLocalAddresses(shippingAddresses || []);
        }
      },
      onError: (error) => {
        openNotification({
          body: `Алдаа гарлаа: ${error.message}`,
          type: "error",
        });
        // Алдаа гарвал буцаан сэргээх
        setLocalAddresses(shippingAddresses || []);
      },
    }
  );

  useEffect(() => {
    if (localAddresses && localAddresses?.length === 1) {
      setSelectedAddressId(localAddresses[0].id);
    }
  }, [localAddresses]);

  const handleOpenDrawer = () => {
    showDrawer({
      title: "Хаяг нэмэх",
      width: "500px",
      content: <UserAddressForm onCancel={() => closeDrawer()} />,
    });
    // Drawer нээгдсэний дараа loading-ийг унтраах
    setTimeout(() => setLoading(false), 100);
  };

  const handleEditAddress = (editAddressData: ShippingAddress) => {
    showDrawer({
      title: "Хаяг засах",
      width: "500px",
      content: (
        <UserAddressForm
          editAddressData={editAddressData}
          onCancel={() => closeDrawer()}
        />
      ),
    });
    // Drawer нээгдсэний дараа loading-ийг унтраах
    setTimeout(() => setLoading(false), 100);
  };
  const handleDeleteAddress = (addressId: number, isDefault?: boolean) => {
    if (isDefault) {
      openNotification({
        body: "Үндсэн хүргэлтийн хаягийг устгах боломжгүй.",
        type: "warning",
      });
      return;
    }

    const confirmDelete = () => {
      if (userProfileData?.userId) {
        // Server рүү хүсэлт илгээх
        deleteAddress({
          variables: { addressId },
        }).then(() => {
          dispatch(setUserRequest());
          const nlocalAddresses = localAddresses?.filter(
            (addr) => addr.id !== addressId
          );
          setLocalAddresses(nlocalAddresses);
          const updatedProfileData = {
            ...userProfileData,
            shippingAddresses: nlocalAddresses,
          };
          dispatch(setUserInfo({ userProfile: updatedProfileData }));
        });
      }
    };

    Modal.confirm({
      title: "Хаяг устгах",
      icon: <ExclamationCircleOutlined />,
      content: "Та энэ хаягийг устгахдаа итгэлтэй байна уу?",
      okText: "Тийм",
      okType: "danger",
      cancelText: "Үгүй",
      onOk: confirmDelete,
    });
  };

  const handleSelectAddressCheckout = (item: ShippingAddress) => {
    if (!isCheckout) {
      return;
    }
    console.log(item);
    setSelectedAddressId(item.id);

    // setSelectedAddress
  };
  const mainAddress = (localAddresses ?? []).find((addr) => {
    const validIds = (localAddresses ?? [])
      .map((a) => a?.id)
      .filter((id): id is number => id !== undefined);
    return validIds.length > 0 && addr.id === Math.min(...validIds);
  });

  return (
    <Card
      title={
        <span className="text-sm">
          {title} ({localAddresses?.length || 0})
        </span>
      }
      className="shadow-lg rounded"
      extra={
        <Button
          type="primary"
          size={"small"}
          icon={<PlusOutlined />}
          className="rounded text-xs"
          onClick={() => handleOpenDrawer()}
        >
          {addText}
        </Button>
      }
    >
      <List
        size="small"
        dataSource={localAddresses}
        loading={loading}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                type="text"
                icon={<EditOutlined />}
                className="text-xs"
                key={1}
                onClick={() => handleEditAddress(item)}
              >
                {editText}
              </Button>,

              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                key={2}
                loading={deleteLoading}
                onClick={() => {
                  if (mainAddress?.id !== item.id && item?.id) {
                    handleDeleteAddress(item?.id, item?.isDefault);
                  }
                }}
                disabled={mainAddress?.id === item.id}
              ></Button>,
            ]}
            className="hover:bg-gray-50 rounded-xl px-2 -mx-2 transition-all"
          >
            <List.Item.Meta
              {...(isCheckout
                ? {
                    avatar: (
                      <Button
                        shape={"circle"}
                        type={"dashed"}
                        onClick={() => handleSelectAddressCheckout(item)}
                      >
                        {selectedAddressId === item.id ? (
                          <CircleCheckBig />
                        ) : (
                          <Circle />
                        )}
                      </Button>
                    ),
                  }
                : {})}
              title={
                <div className="flex items-center gap-2">
                  {isCheckout ? (
                    <Button
                      type={"text"}
                      size={"small"}
                      className="text-sm"
                      onClick={() => handleSelectAddressCheckout(item)}
                    >
                      {item.addressTitle}
                    </Button>
                  ) : (
                    <span>{item.addressTitle}</span>
                  )}

                  {mainAddress?.id === item.id && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      Үндсэн
                    </span>
                  )}
                </div>
              }
              description={
                <div className="text-gray-800">
                  <span className="text-sm">{getLocationData(item)}</span>
                  <p className="text-xs">{item?.addressDetail}</p>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default AddressList;
