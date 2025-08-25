import React, { useState, useCallback, useMemo } from "react";

import { Button, Drawer, Spin } from "antd";
import { DrawerContext, Placement } from "../context/DrawerContext";
import { X } from "lucide-react";

interface DrawerProviderProps {
  children: React.ReactNode;
}

export const DrawerProvider: React.FC<DrawerProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [width, setWidth] = useState<string | undefined>();

  const [placement, setPlacement] = useState<Placement>(); // Default placement
  const [content, setContent] = useState<React.ReactNode>(null);

  const showDrawer = useCallback(
    (config: {
      title: string;
      content: React.ReactNode;
      placement?: Placement;
      width: string;
    }) => {
      setTitle(config.title); // Set the title
      setContent(config.content); // Set the content
      setPlacement(config.placement ?? "right"); // Use provided placement or default to "left"
      setIsOpen(true); // Open the drawer
      setLoading(true); // Set loading to true
      setWidth(config?.width);
    },
    []
  );

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
    setLoading(false);
    setTitle("");
    setContent(null);
    setWidth(undefined);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      loading, // Expose loading state
      showDrawer,
      closeDrawer,
      title,
      content,
      placement,
      setLoading,
      width,
      setTitle,
    }),
    [
      isOpen,
      loading,
      showDrawer,
      closeDrawer,
      title,
      content,
      placement,
      setLoading,
      width,
      setTitle,
    ]
  );

  return (
    <DrawerContext.Provider value={value}>
      <Drawer
        closable={false}
        destroyOnClose
        title={
          <div className="flex w-full justify-between items-center ">
            <img
              src="/assets/logo.png"
              alt="Minimally Logo"
              className="h-6 md:h-8 dark:hidden transition-transform duration-300 hover:scale-105"
            />
            <Button
              size={"small"}
              type={"link"}
              onClick={() => closeDrawer()}
            >
              <X size={16} />
            </Button>
          </div>
        }
        placement={placement}
        open={isOpen}
        onClose={closeDrawer}
        loading={loading} // Pass loading state to Drawer
        width={width ?? undefined}
      >
        {content || <Spin />} {/* Render content or a fallback */}
      </Drawer>

      {children}
    </DrawerContext.Provider>
  );
};
