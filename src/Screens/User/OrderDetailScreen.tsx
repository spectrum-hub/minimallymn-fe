import React from "react";
import AccountLayout from "../../components/Layouts/account";
import OrderDetail from "../../components/Order/Detail";

const OrderDetailScreen: React.FC = () => {
  return (
    <AccountLayout>
      <OrderDetail />
    </AccountLayout>
  );
};

export default OrderDetailScreen;
