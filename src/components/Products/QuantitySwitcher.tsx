import { FC, useEffect, useState } from "react";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

interface Props {
  initialAmount?: number;
  amount: number;
  setAmount: (amount: number) => void;
}

const QuantitySwitcher: FC<Props> = ({ initialAmount, amount, setAmount }) => {
  const step = 1;
  const min = step;

  return initialAmount && initialAmount > 0 ? (
    <div className="bg-white p-2 rounded-md">
      <span className="text-sm my-2 block">Тоо ширхэг:</span>
      <QtyOption
        max={initialAmount}
        min={min}
        amount={amount || min}
        step={step}
        setAmount={setAmount}
      />
    </div>
  ) : (
    <div className="rounded-md text-sm  max-w-[440px] bg-orange-100 p-4 my-1">
      Үлдэгдэл дууссан байна дэлгүүрийн ажилтантай <b>72005588</b> утсаар
      холбогдоно уу
    </div>
  );
};

export default QuantitySwitcher;

interface QtyOptionProps {
  amount: number;
  step: number;
  setAmount: (arg: number) => void;
  max: number;
  min: number;
}

const QtyOption: FC<QtyOptionProps> = ({ min, max, step, setAmount, amount }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(timer);
  }, [amount]);

  const handleValueChange = (newValue: number) => {
    if (newValue < min || newValue > max) return;
    setAmount(newValue);
  };

  const decrement = () => handleValueChange(amount - step);
  const increment = () => handleValueChange(amount + step);

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={decrement}
        disabled={amount <= min}
        className="p-2 border rounded-md transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MinusOutlined className="transition-colors duration-200 hover:text-red-500" />
      </button>

      <div
        className={`p-2 border rounded-md text-center w-12 transition-transform duration-300 ease-in-out ${
          animate ? "scale-110 bg-gray-100" : ""
        }`}
      >
        {amount}
      </div>

      <button
        onClick={increment}
        disabled={amount >= max}
        className="p-2 border rounded-md transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PlusOutlined className="transition-colors duration-200 hover:text-green-500" />
      </button>
    </div>
  );
};