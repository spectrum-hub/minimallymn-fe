import { FC } from "react";

interface Props {
  price: number;
}
const LendMnSchedule: FC<Props> = ({ price }) => {
  const priceDivided = `${(price / 4)?.toLocaleString()}₮`;

  return (
    <>
      <img
        src="/lendpay.56e811be.svg"
        alt=""
        className="mb-4 w-[140px] object-contain"
      />

      <img src="/lendpaymentSchedule.svg" alt="" className="mb-6" />

      <h2>Төлөлтийн хуваарь (Урьдчилгаагүй) </h2>
      <ul>
        {[0, 1, 2, 3, 4].map((index) => (
          <li
            key={index}
            className="my-1 bg-orange-500 p-2 text-white rounded-full py-1 font-bold text-md
            flex gap-4 max-w-48
            "
          >
            <span className="rounded-full w-5 h-5 block bg-white text-orange-500 p-0 text-center leading-5">
              {index + 1}{" "}
            </span>
            <span>{index === 0 ? <>0 ₮</> : priceDivided}</span>
          </li>
        ))}
      </ul>
       

      <p className="border rounded-md p-3 mt-4 bg-green-50 text-sm border-green-300 w-full block">
        Бараагаа сагсандаа нэмнэ. Захиалга үүсгэхдээ төлбөрийн төрөл хэсгээс
        LendMN сонгоно. Гарч ирсэн QR кодыг LendMN аппликейшний QR Код цэсрүү
        орон уншуулж төлбөр төлнө
      </p>
    </>
  );
};

export default LendMnSchedule;
