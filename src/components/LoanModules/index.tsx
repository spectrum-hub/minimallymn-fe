import { ChevronRight } from "lucide-react";
import { FC, ReactNode } from "react";
import { useDrawerCtx } from "../../Hooks/use-modal-drawer";
import StorepaySchedule from "./StorepaySchedule";
import LendMnSchedule from "./LendMnSchedule";
import PocketZeroSchedule from "./PocketZeroSchedule";

type LoanService = {
  minimumPrice: number;
  poweredBy: string;
  description: string;
  icon: string;
  className: string;
  textClassName: string;
  content: (price: number) => ReactNode;
};

type ServiceTypes = "storepay" | "pocketzero" | "lendmn";

interface Props {
  productPrice: number;
}

const loanServices: Record<ServiceTypes, LoanService> = {
  storepay: {
    minimumPrice: 100000,
    poweredBy: "powered by Storepay",
    description:
      "Storepay үйлчилгээг ашиглан төлбөрөө 4 хуваан төлөх боломжтой",
    icon: "storepays.png",
    className: "hover:border-blue-400",
    textClassName: "group-hover:text-blue-500 group-hover:bg-blue-100",
    content: (price) => <StorepaySchedule price={price} />,
  },
  pocketzero: {
    minimumPrice: 100000,
    poweredBy: "powered by PocketZero",
    description:
      "PocketZERO Та 30-90 хоногийн хугацаатай зээлээр авах боломжтой.",
    icon: "svPocket-zero.png",
    className: "hover:border-red-400",
    textClassName: "group-hover:text-red-500 group-hover:bg-red-100",
    content: (price) => <PocketZeroSchedule price={price} />,
  },
  lendmn: {
    minimumPrice: 100000,
    poweredBy: "powered by LendMn",
    description:
      "60 хоногт урьдчилгаагүй, шимтгэлгүй, Хүссэнээ аваад Хүслээрээ төл",
    icon: "lendmn.webp",
    className: "hover:border-orange-400",
    textClassName: "group-hover:text-orange-500 group-hover:bg-orange-100",
    content: (price) => <LendMnSchedule price={price} />,
  },
};

const LoanModules: FC<Props> = ({ productPrice }) => {
  const drawerCtx = useDrawerCtx();

  const handleLoanService = (serviceKey: ServiceTypes) => {
    drawerCtx.showDrawer({
      title: "Төлөлтийн хуваарь",
      placement: "right",
      content: loanServices[serviceKey].content(productPrice),
      width: "380px"
    });
    drawerCtx.setLoading(false);
  };

  const availableServices = Object.entries(loanServices).filter(
    ([, service]) => productPrice >= service.minimumPrice
  );

  if (availableServices.length === 0) return null;

  return (
    <div className="flex flex-col justify-start gap-2">
      <h2>Онлайн зээлийн үйлчилгээ</h2>
      {availableServices.map(([serviceKey, service]) => (
        <button
          key={serviceKey}
          id={serviceKey}
          onClick={() => handleLoanService(serviceKey as ServiceTypes)}
          className={`
            flex items-center gap-2 bg-white border p-2 
            text-sm max-w-[440px] text-left transition-transform 
            duration-200 ease-in-out hover:shadow-lg hover:scale-103 
            group rounded-md ${service.className} `}
        >
          <img
            src={`/${service.icon}`}
            alt={service.poweredBy}
            className={` h-11 w-12 rounded object-contain 
              transition-transform duration-200 
              group-hover:scale-110 `}
          />
          <div className="flex-1">
            <p className="text-[13px] my-0 p-0 leading-4">
              {service.description}
            </p>
            <p className="text-[13px] my-0 text-blue-900">
              {service.poweredBy}
            </p>
          </div>
          <ChevronRight
            className={`w-7 h-7 text-blue-400 transition-all 
              duration-200 group-hover:rounded-full 
              ${service.textClassName}`}
          />
        </button>
      ))}
    </div>
  );
};

export default LoanModules;
