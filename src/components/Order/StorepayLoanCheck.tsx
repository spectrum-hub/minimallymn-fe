import { FC } from "react";

type StorepayLoanCheckResponse = {
  __typename: "ReturnResponse";
  status: "success" | "error";
  message: string;
  result: {
    value: boolean;
    data: {
      loanId: number;
      status: "approved" | "pending" | "canceled";
      amount: string;
      description: string;
      storeId: number;
      number: string;
      isExist: boolean;
      isConfirmed: boolean;
    };
    msgList: string[]; // or a custom type if messages are structured
    attrs: Record<string, unknown>;
    status: "Success" | "Failure";
  };
};

const StorepayLoanCheck: FC<{
  storepayLoanCheck: StorepayLoanCheckResponse;
}> = ({ storepayLoanCheck }) => {
  if (!storepayLoanCheck?.result?.data?.loanId) {
    return;
  }
  return (
    <div className="bg-white rounded-md p-2 shadow text-sm">
      <table className="table-loan-response w-full">
        <thead>
          <tr>
            <th colSpan={2} className="text-left pb-4 pt-2">
              <img
                className="h-6"
                src="/StorepayLogo.png"
                alt="Storepay Logo"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className={``}>
            <td>Storepay Зээлийн дугаар:</td>
            <td>{storepayLoanCheck?.result?.data?.loanId}</td>
          </tr>
          <tr className={``}>
            <td>Storepay бүртгэсэн эсэх:</td>
            <td
              className={` rounded p-1 ml-4 text-sm ${
                storepayLoanCheck?.status === "success"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {storepayLoanCheck?.message}
            </td>
          </tr>
          <tr className={``}>
            <td>Зээлийн төлөв:</td>
            <td
              className={` rounded p-1 ml-4 text-sm ${
                storepayLoanCheck?.result?.data?.status === "canceled"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              <b>
                {storepayLoanCheck?.result?.data?.status === "canceled"
                  ? "Цуцлагдсан "
                  : storepayLoanCheck?.result?.data?.status}
              </b>
            </td>
          </tr>
          <tr className={``}>
            <td>Нийт дүн:</td>
            <td>
              <b>
                {Number(
                  storepayLoanCheck?.result?.data?.amount
                ).toLocaleString()}
                ₮
              </b>
            </td>
          </tr>
          <tr className={``}>
            <td>Тайлбар:</td>
            <td>{storepayLoanCheck?.result?.data?.description}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StorepayLoanCheck;

/***
 
    const r = {
    __typename: "ReturnResponse",
        status: "success",
        message: "Амжилттай",
        result: {
            value: false,
            data: {
            loanId: 2794225,
            status: "canceled",
            amount: "385000.0",
            description: "Antmall.mn order: 190, Total: 385000.0",
            storeId: 14817,
            number: "L4128514431",
            isExist: true,
            isConfirmed: false,
            },
            msgList: [],
            attrs: {},
            status: "Success",
        },
    };

 
 ***/
