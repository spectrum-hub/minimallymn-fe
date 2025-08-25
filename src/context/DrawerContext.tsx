import { createContext } from "react";

export type Placement = "left" | "right" | "top" | "bottom"; // Define placement types

interface ContextProps {
  isOpen: boolean;
  loading: boolean; // Include loading state
  title?: string;
  width?: string;
  content?: React.ReactNode;
  placement?: Placement;
  showDrawer: (config: {
    title: string;
    content: React.ReactNode;
    placement?: Placement; // Make placement optional
    width: string;
  }) => void;
  closeDrawer: () => void;
  setLoading: (loading: boolean) => void;
  setTitle: (w: string) => void;
}

export const DrawerContext = createContext<ContextProps>({
  isOpen: false,
  loading: false, // Default loading state
  title: "",
  content: null,
  placement: "left", // Default placement
  showDrawer: () => {},
  closeDrawer: () => {},
  setLoading: () => {},
  width: undefined, 
  setTitle: () => {},
});
