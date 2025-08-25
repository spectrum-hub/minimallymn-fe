import { FC } from "react";
import {
  OrderDetails,
  PocketZeroInvoiceStatusResponse,
} from "../../types/Order";
import QRCode from "react-qr-code";

interface Props {
  order?: OrderDetails;
  pocketStatusQueries?: PocketZeroInvoiceStatusResponse;
}

const PocketZeroApp: FC<Props> = ({ order, pocketStatusQueries }) => {
  const { qr, deeplink } = order?.pocketzeroResponse ?? {};

  const { response } = pocketStatusQueries?.data?.pocketzeroInvoiceDetail ?? {};

  if (!qr) return null;

  return (
    <div className=" bg-white rounded-md shadow text-sm ">
      <h4 className="text-sm font-bold border-b p-3 text-red-600">
        Pocket zero апп ашиглан төлөх
      </h4>

      <div className="flex flex-col items-center space-y-2 p-4 ">
        <div>Та доорх QR кодыг Pocket апп нээн уншуулна уу</div>
        <div className="m-auto ">
          {qr && <QRCode value={qr} size={220} bgColor={"white"} />}
        </div>

        <a
          data-app={deeplink}
          data-store-android
          data-store-ios
          href={deeplink}
          className=" 
            border p-2 rounded-lg flex items-center gap-2 
            max-w-72 border-red-400 m-auto my-1 
        "
        >
          <img
            src={"/images/bankimgs/PocketApp.png"}
            alt="pocketzero"
            className=" object-contain h-9 w-9 "
          />
          <span>Pocket zero апп ашиглан төлөх бол энд дарна уу</span>
        </a>
      </div>

      <table className="m-4 pocket-zero-response-table">
        <thead>
          <tr>
            <th colSpan={2} className="p-2 text-left font-normal"> PocketZero  төлөв </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Дугаар</th>
            <td>{response?.id}</td>
          </tr>
          <tr>
            <th>Төлөв</th>
            <td
              className={`${
                response?.state === "pending"
                  ? "font-bold text-red-600"
                  : "text-black"
              }`}
            >
              {response?.description}
            </td>
          </tr>
          <tr>
            <th>Мерчант</th>
            <td>{response?.senderName}</td>
          </tr>
          <tr>
            <th>Зээлийн дүн</th>
            <td>{Number(response?.amount).toLocaleString()}₮</td>
          </tr>
          <tr>
            <th>Захиалгын дэлгэрэнгүй</th>
            <td>{response?.info}</td>
          </tr>
          <tr>
            <th>Үүсгэсэн огноо</th>
            <td>{response?.createdAt}</td>
          </tr>
          <tr>
            <th>Захиалга дугаар</th>
            <td>{response?.orderNumber}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PocketZeroApp;
