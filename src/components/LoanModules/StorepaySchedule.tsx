import { FC } from "react";
import { StepIcon1, StepIcon2, StepIcon3, StepIcon4 } from "./Icons";

interface Props {
  price: number;
}
const StorepaySchedule: FC<Props> = ({ price }) => {

  const priceDivided = `${(price / 4)?.toLocaleString()}₮`;
  const payments = [
    {
      step: 1,
      label: "Эхний төлөлт",
      amount: priceDivided,
      icon: <StepIcon1 />,
    },
    {
      step: 2,
      label: "2 дахь төлөлт",
      amount: priceDivided,
      icon: <StepIcon2 />,
    },
    {
      step: 3,
      label: "3 дахь төлөлт",
      amount: priceDivided,
      icon: <StepIcon3 />,
    },
    {
      step: 4,
      label: "4 дахь төлөлт",
      amount: priceDivided,
      icon: <StepIcon4 />,
    },
  ];

  return (
    <>
      <img
        src="/StorepayLogo.png"
        alt=""
        className=" mb-10 w-[140px] object-contain"
      />
      <div className="flex flex-col gap-4">
        {payments.map((payment) => (
          <div key={payment.step} className="flex items-center gap-3">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full border `}
            >
              {payment.icon}
            </div>
            <div className="flex-1 text-sm font-medium">
              {payment.label} -{" "}
              <span className="font-bold">{payment.amount}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border rounded-md p-3 mt-8 bg-green-50 text-sm border-green-300 w-full block">
        <p>
          Та <b>САГСАНД НЭМЭХ</b> товчийг дарж сагслан Төлбөрийн нөхцлүүдээс
          Storepay -ийг сонгон худалдан авалтаа хийгээрэй.
        </p>

        <p className="mt-2">
          Та бүтээгдэхүүнээ хүүгүй, шимтгэлгүй 4 хуваан төлөх нөхцлөөр авах
          боломжтой.
        </p>
      </div>
    </>
  );
};

export default StorepaySchedule;
