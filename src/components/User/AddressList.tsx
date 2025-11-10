import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { gql, useMutation } from "@apollo/client";
import { userInfoAsync } from "../../Redux/userActions";
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

const DELETE_SHIPPING_ADDRESS = gql`
  mutation DeleteShippingAddress($addressId: Int!) {
    deleteShippingAddress(addressId: $addressId) {
      success
      message
    }
  }
`;

const AddressList: React.FC = () => {
  const { showDrawer, closeDrawer, setLoading } = useDrawerCtx();

  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.userInfo) ?? {};
  const { shippingAddresses, shippingAddressesConfig } =
    data?.userProfile ?? {};

  const { addText, editText, deleteText, title } =
    shippingAddressesConfig ?? {};
  const { openNotification } = useNotification();
  // Local state for optimistic UI
  const [localAddresses, setLocalAddresses] = useState(shippingAddresses || []);

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
          // Redux state-ийг шинэчлэх
          dispatch(userInfoAsync());
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

  const handleOpenDrawer = () => {
    showDrawer({
      title: "Хаяг нэмэх",
      width: "500px",
      content: (
        <UserAddressForm
          onSuccess={() => {
            dispatch(userInfoAsync());
            closeDrawer();
          }}
          onCancel={() => closeDrawer()}
        />
      ),
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
      // Optimistic UI: Шууд жагсаалтаас хас
      setLocalAddresses((prev) => prev.filter((addr) => addr.id !== addressId));

      // Server рүү хүсэлт илгээх
      deleteAddress({
        variables: { addressId },
      });
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

  const mainAddress = localAddresses.find(
    (addr) => addr.id === Math.min(...localAddresses.map((a) => a.id))
  );

  return (
    <Card
      title={
        <span className="text-lg font-semibold">
          {title} ({localAddresses?.length || 0})
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
          {addText}
        </Button>
      }
    >
      <List
        itemLayout="horizontal"
        dataSource={localAddresses}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                type="text"
                icon={<EditOutlined />}
                className="text-blue-600"
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
                  if (mainAddress?.id !== item.id) {
                    handleDeleteAddress(item?.id, item?.isDefault);
                  }
                }}
                disabled={mainAddress?.id === item.id}
              >
                {deleteText}
              </Button>,
            ]}
            className="hover:bg-gray-50 rounded-xl px-2 -mx-2 transition-all"
          >
            <List.Item.Meta
              title={
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{item.addressTitle}</span>
                  {mainAddress?.id === item.id && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      Үндсэн
                    </span>
                  )}
                </div>
              }
              description={
                <div className="text-gray-600">
                  <p>{item?.addressDetail}</p>
                  <span>{getLocationData(item)}</span>
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
