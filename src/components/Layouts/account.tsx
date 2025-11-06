import React from "react";
import { NavLink, matchPath, useLocation } from "react-router";
import { User, Files, MessageCircleQuestion, LogOut, Menu } from "lucide-react";
import { Popconfirm } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useHistoryNavigate } from "../../Hooks/use-navigate";

const menuItems = [
  { link: "/account/profile", icon: <User className="w-5 h-5" />, label: "Профайл" },
  { link: "/account/phone-update", icon: <User className="w-5 h-5" />, label: "Утас" },
  { link: "/account/orders", icon: <Files className="w-5 h-5" />, label: "Захиалга" },
  { link: "/account/password", icon: <User className="w-5 h-5" />, label: "Нууц үг" },
  { link: "/account/support", icon: <MessageCircleQuestion className="w-5 h-5" />, label: "Тусламж" },
];

const AccountLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const pathname = useLocation().pathname;
  const { historyNavigate } = useHistoryNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const confirm = () => {
    historyNavigate("/account/logout");
  };

  const isActive = (path: string) => {
    return !!matchPath(pathname, path);
  };

  // Mobile Bottom Navigation
  const MobileBottomNav = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-5 gap-1 p-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.link}
            to={item.link}
            className="flex flex-col items-center py-2 px-1 rounded-lg transition-all"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className={`p-2 rounded-full transition-colors ${
              isActive(item.link)
                ? "bg-gray-900 text-white"
                : "text-gray-500"
            }`}>
              {item.icon}
            </div>
            <span className={`text-[10px] mt-1 font-medium ${
              isActive(item.link) ? "text-gray-900" : "text-gray-500"
            }`}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
      
      {/* Logout Button in Bottom Nav */}
      <div className="px-4 pb-3">
        <Popconfirm
          title="Гарах уу?"
          description="Та системээс гарахдаа итгэлтэй байна уу?"
          onConfirm={confirm}
          okText="Тийм"
          cancelText="Болих"
          placement="top"
        >
          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Гарах</span>
          </button>
        </Popconfirm>
      </div>
    </div>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <aside className="hidden lg:block lg:w-80">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Миний Аккаунт</h2>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.link}
              to={item.link}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(item.link)
                  ? "bg-gray-900 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Popconfirm
            title="Системээс гарах"
            description="Та үнэхээр гарахыг хүсэж байна уу?"
            onConfirm={confirm}
            okText="Тийм"
            cancelText="Үгүй"
            placement="top"
          >
            <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all group">
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Системээс гарах</span>
            </button>
          </Popconfirm>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile Header */}
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Миний Аккаунт</h1>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="mt-3 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <nav className="p-3">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.link}
                    to={item.link}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-all ${
                      isActive(item.link)
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <DesktopSidebar />
          <main className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 min-h-[600px]">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isAuthenticated && <MobileBottomNav />}
    </div>
  );
};

export default AccountLayout;
