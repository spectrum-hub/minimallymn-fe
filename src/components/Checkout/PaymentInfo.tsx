import { Spin } from "antd";
import { FC, useMemo } from "react";
import { Cart } from "../../types/Cart";
import { useHistoryNavigate } from "../../Hooks/use-navigate";
import { RootState } from "../../Redux/store";
import { useSelector } from "react-redux";

// Inline truck icon for monochrome look
const TruckIcon: FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}>
    <path
      fill="currentColor"
      d="M3 6h11v8h-1.5a2.5 2.5 0 1 0 0 5H18a2.5 2.5 0 1 0 0-5h1v-3.2L17.6 8H16V6h2.7L22 10.8V14h1v2h-1.1a2.5 2.5 0 0 1-4.9 0H12a2.5 2.5 0 0 1-4.9 0H3V6Z"
    />
  </svg>
);

interface PaymentInfoItemProps {
  label?: string;
  value?: string | number;
  className?: string;
}

const Row: FC<PaymentInfoItemProps> = ({ label, value, className }) => (
  <div className={["flex items-center justify-between", className].join(" ")}>
    <span className="text-neutral-600 dark:text-neutral-300 text-[13px]">
      {label}
    </span>
    <span className="text-neutral-900 dark:text-white text-[13px] font-medium">
      {value}
    </span>
  </div>
);

interface PaymentInfoProps {
  cartItem?: Cart | object;
  cartLoading: boolean;
  showNextButton?: boolean;
  nextPath?: string;
}

const PaymentInfo: FC<PaymentInfoProps> = ({
  cartItem,
  cartLoading,
  nextPath,
  showNextButton = true,
}) => {
  const { historyNavigate } = useHistoryNavigate();
  const themeGrid = useSelector(
    (state: RootState) => state.layouts?.data?.themeGrid
  );

  const paymentAccounts = themeGrid?.payments ?? [];

  const cart = cartItem as Cart | undefined;

  const cartTotalItems = useMemo(
    () =>
      (cart?.orderLines ?? []).reduce((acc, it) => acc + (it.quantity ?? 0), 0),
    [cart]
  );

  const deliveries = useMemo(() => {
    return (cart?.selectedDeliveriers ?? []).map((d) => ({
      label: d.product?.name,
      value: `${d?.priceTotal?.toLocaleString?.() ?? 0}₮`,
    }));
  }, [cart]);

  const items = [
    { label: "Захиалгын дугаар", value: cart?.name ? `#${cart.name}` : "-" },
    { label: "Барааны тоо", value: cartTotalItems ?? 0 },
    {
      label: "Барааны нийт үнэ",
      value: `${cart?.amountTotal?.toLocaleString?.() ?? "0"}₮`,
    },
    { label: "НӨАТ", value: "0₮" },
    ...deliveries,
  ];

  const paymentAcnts = (paymentAccounts ?? []).flatMap((payAcnt) => [
    { label: "Банк:", value: payAcnt.bankName },
    { label: "IBAN - дугаар:", value: payAcnt.bankIban },
    { label: "Дансны дугаар:", value: payAcnt.bankAccount },
    { label: "Дансны нэр:", value: payAcnt.bankAccountName },
  ]);

  return (
    <>
      {nextPath === "/checkout" ? (
        <section
          className="bg-white/90 dark:bg-neutral-900/80 backdrop-blur border border-neutral-200 dark:border-neutral-800
                  p-5 md:p-6 text-sm text-neutral-800 dark:text-neutral-200 h-fit"
          aria-labelledby="payment-info-title"
        >
          <h2
            id="payment-info-title"
            className="text-[14px] font-semibold text-neutral-900 dark:text-white pb-3 mb-4 border-b border-neutral-200 dark:border-neutral-800"
          >
            Төлбөр төлөх дансны мэдээлэл
          </h2>
          {(paymentAcnts ?? []).map((it, i) => (
            <Row key={i} {...it} />
          ))}
        </section>
      ) : null}

      <section
        className="bg-white/90 dark:bg-neutral-900/80 backdrop-blur border border-neutral-200 dark:border-neutral-800
                  p-5 md:p-6 text-sm text-neutral-800 dark:text-neutral-200 h-fit"
        aria-labelledby="payment-info-title"
      >
        <h2
          id="payment-info-title"
          className="text-[14px] font-semibold text-neutral-900 dark:text-white pb-3 mb-4 border-b border-neutral-200 dark:border-neutral-800"
        >
          Төлбөрийн мэдээлэл
        </h2>

        <div className="space-y-3">
          {items.map((it, i) => (
            <Row key={i} {...it} />
          ))}

          <div className="pt-4 mt-2 border-t border-neutral-200 dark:border-neutral-800">
            <Row
              label="Нийт"
              value={`${(cart?.amountTotal ?? 0).toLocaleString()}₮`}
              className="text-[15px] font-semibold"
            />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2 text-[13px] text-neutral-600 dark:text-neutral-300">
            <TruckIcon className="w-4 h-4" />
            <span>Хүргэлт 24 цагийн дотор хүргэгдэнэ</span>
          </div>

          {showNextButton && nextPath ? (
            <Spin spinning={cartLoading} size="small">
              <button
                type="button"
                onClick={() => historyNavigate(nextPath)}
                className="w-full h-10 px-4 rounded-md bg-black text-white text-[13px] font-medium
                         hover:bg-black/90 active:scale-[0.98] transition
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                aria-busy={cartLoading}
              >
                Худалдан авах
              </button>
            </Spin>
          ) : null}
        </div>
      </section>
    </>
  );
};

export default PaymentInfo;
