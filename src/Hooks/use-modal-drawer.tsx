import { useContext } from "react";
import { DrawerContext } from "../context/DrawerContext";

const useDrawerCtx = () => useContext(DrawerContext);

export { useDrawerCtx };
