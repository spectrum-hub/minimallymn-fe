import { FC, ReactNode, useMemo } from "react";
import StorepaySchedule from "./StorepaySchedule";
import PocketZeroSchedule from "./PocketZeroSchedule";

// Replace lucide with a tiny inline SVG for a unified look


type LoanService = {
  minimumPrice: number;
  poweredBy: string;
  description: string;
  icon: string; // path to brand logo (raster ok)
  content: (price: number) => ReactNode;
};

type ServiceTypes = "storepay" | "pocketzero";

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
    content: (price) => <StorepaySchedule price={price} />,
  },
  pocketzero: {
    minimumPrice: 100000,
    poweredBy: "powered by PocketZero",
    description:
      "PocketZERO Та 30-90 хоногийн хугацаатай зээлээр авах боломжтой.",
    icon: "svPocket-zero.png",
    content: (price) => <PocketZeroSchedule price={price} />,
  },
};

const LoanModules: FC<Props> = ({ productPrice }) => {

  const available = useMemo(
    () =>
      Object.entries(loanServices).filter(
        ([, s]) => productPrice >= s.minimumPrice
      ),
    [productPrice]
  );

  if (available.length === 0) return null;

  return (
    <section
      className="mb-4 w-full text-[13px] md:text-sm text-neutral-700 dark:text-neutral-300"
      aria-labelledby="loan-services-title"
    >
      <h2
        id="loan-services-title"
        className="mb-2 tracking-wide uppercase text-[11px] text-neutral-500 dark:text-neutral-400 text-center md:text-left"
      >
        Зээлийн үйлчилгээ
      </h2>

      <div className="flex flex-col items-center md:items-start gap-2">
        {available.map(([key, s]) => (
          <div
            key={key}
            className="group w-full max-w-[720px] md:max-w-[560px] lg:max-w-[480px]
                       flex items-center gap-3 px-3 py-2  text-left
                       bg-white/90 dark:bg-neutral-900/80 backdrop-blur
                       border border-neutral-200 dark:border-neutral-800
                       hover:bg-neutral-50 dark:hover:bg-neutral-800
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/20
                       transition-colors"
          >
            <img
              src={`/${s.icon}`}
              alt={s.poweredBy}
              className="h-8 w-10 object-contain rounded-sm opacity-90 group-hover:opacity-100 transition"
              loading="lazy"
            />

            <div className="flex-1 min-w-0">
              <p className="m-0 leading-5 text-[13px] text-neutral-800 dark:text-neutral-100 ">
                {s.description}
              </p>
              <p className="m-0 leading-4 text-[12px] text-neutral-500 dark:text-neutral-400">
                {s.poweredBy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LoanModules;
