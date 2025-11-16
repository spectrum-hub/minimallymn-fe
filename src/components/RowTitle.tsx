import { FC } from "react";

interface Prop {
  title?: string | null;
}
const RowTitle: FC<Prop> = ({ title }) => {
  if (!title) {
    return;
  }
  return (
    <div className="relative mb-8 md:mb-12 mt-8">
      <h2 className="text-xl md:text-2xl  font-bold text-center bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
        {title}
      </h2>
      <div className="mx-auto mt-3 h-1 w-20 bg-gradient-to-r from-black to-gray-400 rounded-full"></div>
    </div>
  );
};

export default RowTitle;
