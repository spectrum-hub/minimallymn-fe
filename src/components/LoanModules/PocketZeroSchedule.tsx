import { FC } from "react";

interface Props {
  price: number;
}
const PocketZeroSchedule: FC<Props> = ({ price }) => {
  return (
    <>
      <img
        src="/PocketZeroLogo.png"
        alt=""
        className="mb-4 w-[140px] object-contain"
      />
      <table className={`price-${price} text-left text-sm`} cellPadding={6} border={0}>
        <thead>
          <tr>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Зээлийн доод хэмжээ:</th>
            <td>
              <b>100,000₮</b>
            </td>
          </tr>
          <tr>
            <th>Хүү:</th>
            <td>Хүүгүй</td>
          </tr>
          <tr>
            <th>Урьдчилгаа:</th>
            <td>Урьдчилгаагүй</td>
          </tr>
          <tr>
            <th>Хугацаа: </th>
            <td>
              15 хоногийн давтамжтайгаар 2-6 хуваагаад хүүгүй 30-90 хоногийн
              хугацаандтөлөх боломжтой.
            </td>
          </tr>
        </tbody>
      </table>
      <p className="border rounded-md p-3 mt-4 bg-green-50 text-sm border-green-300 w-full block">
        Бараагаа сагсандаа нэмнэ. PocketZERO үйлчилгээг ашиглан хүссэн бараа
        бүтээгдэхүүнээ урьдчилгаагүй, шимтгэлгүй 6 хувааж төл
      </p>
    </>
  );
};

export default PocketZeroSchedule;
