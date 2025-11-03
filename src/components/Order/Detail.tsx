import { useParams } from "react-router";
import useGqlQuery from "../../Hooks/Query";
import {
  GET_ORDER_DETAIL,
  PocketZeroInvoiceDETAIL,
  STOREPAY_LOAN_CHECK,
} from "../../api/order";
import { OrderDetailQuery, OrderDetails } from "../../types/Order";
import { FC, useEffect } from "react";

import QpayBankDeepLink from "./QpayBankDeepLink";
import useWindowWidth from "../../Hooks/use-window-width";
import { useLazyQuery } from "@apollo/client";
import {
  ErrorMessage,
  InfoCard,
  LoadingOrder,
  OrderNotFound,
} from "./elements";
import { orderTotals } from "./totals";
import { partnerInfos } from "./partner";
import StorepayLoanCheck from "./StorepayLoanCheck";
import PocketzeroResponse from "./PocketzeroResponse";
import OrderLinesItems from "./orderLineItems";
import LendMnResponse from "./LendMnResponse";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

const OrderDetailComponent = () => {
  const { orderId } = useParams();
  const { isMobile } = useWindowWidth();

    const themeGrid = useSelector(
    (state: RootState) => state.layouts?.data?.themeGrid
  );

  const paymentAccounts = themeGrid?.payments ?? [];

  const paymentAcnts = (paymentAccounts ?? []).flatMap((payAcnt) => [
    { label: "Банк:", value: payAcnt.bankName },
    { label: "IBAN - дугаар:", value: payAcnt.bankIban },
    { label: "Дансны дугаар:", value: payAcnt.bankAccount },
    { label: "Дансны нэр:", value: payAcnt.bankAccountName },
  ]);

  

  const { loading, error, data } = useGqlQuery<OrderDetailQuery>(
    GET_ORDER_DETAIL,
    { orderId: orderId as string }
  );
  const order = data?.orderDetails;

  // Lazy query for storepayLoanCheck
  // storepayQueries ={ data: loanCheckData, loading: loanCheckLoading, error: loanCheckError }
  const [fetchLoanCheck, storepayQueries] = useLazyQuery(STOREPAY_LOAN_CHECK);
  const [fetchPocketStatus, pocketStatusQueries] = useLazyQuery(
    PocketZeroInvoiceDETAIL
  );

  useEffect(() => {
    if (order?.paymentMethodDesc === "storepay") {
      if (orderId) {
        fetchLoanCheck({ variables: { orderId: order.id } });
      }
    } else if (order?.paymentMethodDesc === "pocketzero") {
      if (orderId) {
        fetchPocketStatus({ variables: { orderId: order.id } });
      }
    }
  }, [fetchLoanCheck, fetchPocketStatus, order, orderId]);

  if (loading) return <LoadingOrder />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!order) return <OrderNotFound />;
 
  return (
    <>
      {/* Order Items */}

      {!isMobile ? <OrderLinesItems order={order} /> : null}

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StorepayLoanCheck
          storepayLoanCheck={storepayQueries?.data?.storepayLoanCheck}
        />

        <PocketzeroResponse
          order={order}
          pocketStatusQueries={pocketStatusQueries}
        />

        <LendMnResponse order={order} />
        <QpayMethodInvoice order={order} isMobile={isMobile} />
        <InfoCard {...orderTotals(order)} />
        <InfoCard {...partnerInfos(order)} />
        <InfoCard title={"Төлбөр төлөх дансны мэдээлэл"} items={paymentAcnts} />
        

        {isMobile ? <OrderLinesItems order={order} /> : null}
      </div>
    </>
  );
};

export default OrderDetailComponent;

const QpayMethodInvoice: FC<{
  order: OrderDetails;
  isMobile?: boolean;
}> = ({ order, isMobile }) => {
  
  if (!order?.qpayInvoice?.qrImage) {
    return;
  }
  if (isMobile) {
    return <QpayBankDeepLink links={order?.qpayInvoice?.bankList} />;
  }

  return (
    <div className="w-full my-1 text-sm text-center">
      <p className="my-2">QPAY QR - код уншуулах</p>
      <img
        className="w-60 shadow-lg hover:shadow-xl mx-auto"
        src={"data:image/png;base64, " + order?.qpayInvoice?.qrImage}
        alt={"qpay"}
      />

      <p className="my-2 max-w-80 mx-auto text-xs">
        Голомт банкнаас бусад банкны аппликейшн ашиглан уншуулах боломжтой
      </p>
    </div>
  );
};
