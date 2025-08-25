import styles from "@/main.module.css";
import React from "react";
import { NavLink, matchPath, useLocation } from "react-router";
import { User, Files, MessageCircleQuestion, LogOut } from "lucide-react";
import type { PopconfirmProps } from "antd";
import { Button, Popconfirm } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import useWindowWidth from "../../Hooks/use-window-width";
import { useHistoryNavigate } from "../../Hooks/use-navigate";

const items = [
  { link: "/account/profile", icon: <User />, label: "Хувийн мэдээлэл" },
  { link: "/account/orders", icon: <Files />, label: "Захиалгууд" },
  {
    link: "/account/support",
    icon: <MessageCircleQuestion />,
    label: "Тусламж ",
  },
];

const AccountLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const authState = useSelector((state: RootState) => state.auth);
  const { isMobile } = useWindowWidth();

  const pathname = useLocation()?.pathname;
  const { historyNavigate } = useHistoryNavigate();

  const confirm: PopconfirmProps["onConfirm"] = () => {
    historyNavigate("/account/logout");
  };

  return (
    <section
      className={` flex flex-col md:flex-row gap-4 pt-4 `}
    >
      <aside
        className={`
          w-full md:w-1/4 flex flex-col 
          items-center p-4 rounded-lg 
          shadow-md h-full
        `}
      >
        {authState?.isAuthenticated ? (
          <ul className="w-full flex md:block">
            {items.map((menu, i) => (
              <li key={i} className="w-full mb-3">
                <NavLink
                  to={menu.link}
                  className={`
                   flex flex-col items-center gap-3 
                   p-1 md:p-3
                   w-full text-gray-700 
                  hover:bg-gray-200 rounded-lg transition 
                  ${
                    matchPath(pathname, menu.link)
                      ? "font-bold bg-gray-200 text-blue-800"
                      : ""
                  }`}
                >
                  {menu.icon}
                  <span className="text-sm md:text-md">{menu.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        ) : null}

        {!isMobile ? (
          <Popconfirm
            title=""
            description={
              <span className="text-sm">
                Системээс гарахдаа итгэлтэй <br />
                байна уу ?
              </span>
            }
            onConfirm={confirm}
            okText="Тийм"
            cancelText="Үгүй"
          >
            <Button
              size={"small"}
              danger
              type={"link"}
              className={` mt-20 `}
              icon={<LogOut />}
            >
              <span className="text-sm md:text-md">Системээс гарах</span>
            </Button>
          </Popconfirm>
        ) : null}
      </aside>
      <div className="p-1 pb-12 w-full">{children}</div>

      {isMobile ? (
        <Popconfirm
          title=""
          description={
            <span className="text-sm">
              Системээс гарахдаа итгэлтэй <br />
              байна уу ?
            </span>
          }
          onConfirm={confirm}
          okText="Тийм"
          cancelText="Үгүй"
        >
          <Button
            size={"small"}
            danger
            type={"link"}
            className={`my-1 mb-8`}
            icon={<LogOut />}
          >
            <span className="text-sm md:text-md">Системээс гарах</span>
          </Button>
        </Popconfirm>
      ) : null}

    </section>
  );
};

export default AccountLayout;
