import React from "react";
import { NavLink, matchPath, useLocation } from "react-router";
import { User, Files, MessageCircleQuestion, LogOut } from "lucide-react";
import type { PopconfirmProps } from "antd";
import { Popconfirm } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useHistoryNavigate } from "../../Hooks/use-navigate";

const items = [
  { link: "/account/profile", icon: <User className="w-4 h-4" />, label: "Хувийн мэдээлэл" },
  { link: "/account/phone-update", icon: <User className="w-4 h-4" />, label: "Гар утас" },
  { link: "/account/orders", icon: <Files className="w-4 h-4" />, label: "Захиалгууд" },
  { link: "/account/password", icon: <User className="w-4 h-4" />, label: "Нууц үг" },
  {
    link: "/account/support",
    icon: <MessageCircleQuestion className="w-4 h-4" />,
    label: "Тусламж",
  },
];

const AccountLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const authState = useSelector((state: RootState) => state.auth);
  const pathname = useLocation()?.pathname;
  const { historyNavigate } = useHistoryNavigate();

  const confirm: PopconfirmProps["onConfirm"] = () => {
    historyNavigate("/account/logout");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-80">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {authState?.isAuthenticated && (
                <nav className="space-y-2 flex flex-row md:flex-col gap-4">
                  {items.map((menu, i) => (
                    <NavLink
                      key={i}
                      to={menu.link}
                      className={`flex items-center gap-3 
                        p-2
                        rounded-lg text-sm font-medium transition-colors ${
                        matchPath(pathname, menu.link)
                          ? "bg-gray-900 text-white"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {menu.icon}
                      <span className="text-xs md:text-sm">{menu.label}</span>
                    </NavLink>
                  ))}
                </nav>
              )}

              <div className="mt-8 pt-6 border-t border-gray-100">
                <Popconfirm
                  title="Системээс гарах"
                  description="Та системээс гарахдаа итгэлтэй байна уу?"
                  onConfirm={confirm}
                  okText="Тийм"
                  cancelText="Үгүй"
                  placement="top"
                >
                  <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span>Системээс гарах</span>
                  </button>
                </Popconfirm>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
