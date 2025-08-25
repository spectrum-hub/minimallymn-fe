import React, { useCallback, useEffect, useState } from "react";
import AccountLayout from "../../components/Layouts/account";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { accountOrdersAsync } from "../../Redux/accountOrdersActions";
import { NavLink } from "react-router"; 
import { paymentMethodDescFormat } from "../../components/Checkout/helpers";
import { useHistoryNavigate } from "../../Hooks/use-navigate";
 
const OrdersScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.accountOrders
  );

  const authState = useSelector((state: RootState) => state.auth);
  const { historyNavigate } = useHistoryNavigate();
  useEffect(() => {
    if (!authState?.isAuthenticated) {
      historyNavigate("/auth/login");
      // /acount/orders/4Io=c
    }
  }, [authState?.isAuthenticated, historyNavigate]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 100;

  // Fetch orders function to reuse in useEffect and refresh
  const fetchOrders = useCallback(
    (page: number) => {
      dispatch(
        accountOrdersAsync({
          page,
          pageSize,
          orderBy: "dateOrder",
        })
      );
    },
    [dispatch]
  );

  // Reset page and fetch orders when component mounts or re-enters
  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 on mount
    fetchOrders(1); // Fetch initial page
  }, [dispatch, fetchOrders]); // Only depend on dispatch, not currentPage, for initial load

  // Fetch subsequent pages when currentPage changes
  useEffect(() => {
    if (currentPage > 1) {
      console.log("Fetching page:", currentPage);
      fetchOrders(currentPage);
    }
  }, [currentPage, dispatch, fetchOrders]);

  const formatDate = (dateString: string) => {
    return dateString; // Consider formatting with Date object if needed
  };



  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()}₮`;
  };

  if (loading && !data) {
    // Show loading only if no data exists yet
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600 bg-red-100 rounded-lg m-4">
        Error: {error}
        <button
          onClick={() => fetchOrders(currentPage)}
          className="ml-4 bg-blue-500 text-white py-1 px-3 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <AccountLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Захиалгууд
          </h2>
          <button
            onClick={() => fetchOrders(1)} // Refresh by fetching page 1
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold
            text-xs  p-1 rounded
            "
          >
            Дахин дуудах
          </button>
        </div>

        {(data?.orders?.length ?? 0) > 0 ? (
          <div className="space-y-4">
            {(data?.orders ?? []).map((order) => (
              <NavLink
                to={`/account/orders/${order.id}`} // Fixed template literal
                key={order.id}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 block"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Захиалга: {order.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(order.dateOrder)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="text-xs">Төлбөр: </span> 
                      <b>{paymentMethodDescFormat(order.paymentMethodDesc)}</b>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(order.amountTotal)}
                    </p>
                    <p className="text-sm capitalize">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.state === "sent"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.state}
                      </span>
                    </p>
                  </div>
                </div>
                {/* <div className="mt-2 text-sm text-gray-600">
                  Partner ID: {order.partnerId}
                </div> */}
              </NavLink>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No orders available</p>
          </div>
        )}

        {data?.pageInfo?.hasNextPage && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-200"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </AccountLayout>
  );
};

export default OrdersScreen;
