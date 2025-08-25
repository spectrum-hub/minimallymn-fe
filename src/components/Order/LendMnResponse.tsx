import { FC } from "react";
import { OrderDetails } from "../../types/Order";
import QRCode from "react-qr-code";

interface Props {
  order?: OrderDetails;
}

const LendMnResponse: FC<Props> = ({ order }) => {
  const lendmnRes = order?.lendmnResponse ?? {};

  if (!lendmnRes?.qr) return null;

  return (
    <div className=" bg-white rounded-md shadow text-sm ">
      <h4 className="text-sm font-bold border-b p-3 text-red-600">
        ЛэндМн (LendMn) апп ашиглан төлөх
      </h4>

      <div className="flex flex-col items-center space-y-2 p-4 ">
        <div>Та доорх QR кодыг ЛэндМн апп нээн уншуулна уу</div>
        <div className="m-auto ">
          {lendmnRes?.qr && (
            <QRCode value={lendmnRes?.qr} size={220} bgColor={"white"} />
          )}
        </div>

        <a
          data-app={lendmnRes?.deeplink}
          data-store-android
          data-store-ios
          href={lendmnRes?.deeplink}
          className=" 
            border p-2 rounded-lg flex items-center gap-2 
            max-w-72 border-red-400 m-auto my-1 
        "
        >
          <img
            src={"/lendmnicon.png"}
            alt="lendmnicon"
            className=" object-contain h-9 w-9 "
          />
          <span>LendMn апп ашиглан төлөх бол энд дарна уу</span>
        </a>
      </div>

      <table className="m-4 pocket-zero-response-table">
        <thead>
          <tr>
            <th colSpan={2} className="p-2 text-left font-normal">
              LendMn төлөв{" "}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th> ЛэндМн захиалгын дугаар</th>
            <td>{lendmnRes?.invoiceId}</td>
          </tr>
          <tr>
            <th>Төлөв</th>
            <td
              className={`${
                lendmnRes?.info === "Хүлээгдэж байгаа"
                  ? "font-bold text-red-600"
                  : "text-black"
              }`}
            >
              {lendmnRes?.info}
            </td>
          </tr>
          <tr>
            <th>Зээлийн дүн</th>
            <td>{Number(lendmnRes?.amount).toLocaleString()}₮</td>
          </tr>
          <tr>
            <th>Захиалгын дэлгэрэнгүй</th>
            <td>{lendmnRes?.description}</td>
          </tr>

          <tr>
            <th>Захиалга дугаар</th>
            <td>{lendmnRes?.orderNumber}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LendMnResponse;
