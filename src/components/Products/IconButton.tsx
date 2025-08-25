import { Spin } from "antd";
import { Eye, Heart, Trash2 } from "lucide-react";
import { FC } from "react";

interface Props {
  onClick?: () => void;
  icon: "heart" | "eye" | "delete";
  className?: string;
  loading?: boolean;
}
const IconButton: FC<Props> = ({ onClick, icon, className, loading }) => {
  return (
    <button
      className={`
          h-10 w-10 rounded-full shadow-lg 
          transition-all duration-200 hover:-translate-y-1 hover:scale-110 
          hover:bg-white hover:shadow-xl flex justify-center items-center
          ${className}
          ${icon === "delete" ? "border border-red-400 border-dashed" : ""}
        `}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? <Spin /> : null}
      {!loading && icon === "heart" ? <Heart className="h-4 w-4" /> : <></>}
      {!loading && icon === "eye" ? <Eye className="h-4 w-4" /> : <></>}
      {!loading && icon === "delete" ? <Trash2 className="h-4 w-4" /> : <></>}
    </button>
  );
};

export default IconButton;
