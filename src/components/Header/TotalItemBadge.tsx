import { motion, AnimatePresence } from "framer-motion";
import { FC } from "react";

const TotalItemBadge: FC<{ totalItem?: number }> = ({ totalItem }) => {
  if (!totalItem || Number?.(totalItem) === 0) {
    return;
  }
  return (
    <AnimatePresence>
      <motion.span
        key={totalItem} // Triggers animation on value change
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className={`
            absolute -top-[1px] -right-1 bg-red-500 
          text-white text-[11px] font-bold p-1 h-4 min-w-4
            rounded-full flex items-center justify-center
          outline-red-100 outline
        `}
      >
        {totalItem}
      </motion.span>
    </AnimatePresence>
  );
};

export default TotalItemBadge;
