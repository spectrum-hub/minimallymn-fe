import { FC } from "react";
import { StepValues } from "../../types/Common";
import { Locations } from "../../Screens/Checkout/AddressScreen";

const StepUserAddress: FC<{
  step1Data?: StepValues | null;
  addressDetail?: Partial<Locations>;
}> = ({ step1Data, addressDetail }) => {
  return (
    <div className="text-gray-700 space-y-1 text-sm">
      <p>
        <strong>Нэр:</strong> {step1Data?.firstname}
      </p>
      <p>
        <strong>Утас:</strong> {step1Data?.s_phone}
      </p>

      {step1Data?.email && (
        <p>
          <strong>Email:</strong> {step1Data?.email}
        </p>
      )}
      {step1Data?.customer_type === "organization" &&
        step1Data?.register_org && (
          <p>
            <strong>Байгууллагын регистер:</strong> {step1Data?.register_org}
          </p>
        )}
      <p>
        <strong>Хаяг:</strong>
        {[
          addressDetail?.city,
          addressDetail?.district,
          addressDetail?.baghoroo,
          step1Data?.s_address,
        ]
          .filter(Boolean)
          .join(", ")}
      </p>
    </div>
  );
};

export default StepUserAddress;
