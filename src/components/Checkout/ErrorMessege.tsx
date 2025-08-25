import { FC } from "react";

const ErrorMessege: FC<{
  message?: string;
  messageBold?: string;
}> = ({ message, messageBold }) => {
  if (!message) {
    return;
  }

  return (
    <div className=" text-white py-2 md:py-4 bg-red-600 text-sm rounded-lg px-4 mb-4  ">
      <b className="uppercase">{messageBold}</b>
      {": "}
      {message
        ?.replace("Validation failed:", " ")
        ?.replace(
          "User must exist",
          " Та Storepay - д бүртгүүлэн дахин захиална уу"
        )}
    </div>
  );
};
export default ErrorMessege;
