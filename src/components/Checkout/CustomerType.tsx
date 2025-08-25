import { FC } from "react";
import { CustomerType } from "../../types/Common";
import { Radio } from "antd";

interface Props {
  customer?: CustomerType;
  onChange?: (customer: CustomerType) => void;
}

const TypeOfCustomer: FC<Props> = ({ customer = "citizen", onChange }) => {
  const isCitizen = customer === "citizen";
  return (
    <Radio.Group
      onChange={(v) => onChange?.(v.target.value)}
      name="user_type"
      defaultValue={isCitizen ? "citizen" : "organization"}
      options={[
        { value: "citizen", label: "Хувь хүн" },
        { value: "organization", label: "Албан байгууллага" },
      ]}
      className="my-4"
    />
  );
};

export default TypeOfCustomer;
