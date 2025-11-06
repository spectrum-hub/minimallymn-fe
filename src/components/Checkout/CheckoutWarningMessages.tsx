// src/components/Checkout/CheckoutWarnings.tsx
import React from "react";
import { Tooltip } from "antd";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

interface WarningMessage {
  warningId: number;
  warningText: string;
}

interface CheckoutWarningsProps {
  warnings: WarningMessage[];
  selectedWarnings: Record<number, string> | undefined;
  onToggleWarning: (id: number, text: string) => void;
  onRemoveWarning: (id: number) => void;
}

const minimalMotion = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.12 },
};

const CheckoutWarnings: React.FC<CheckoutWarningsProps> = ({
  warnings,
  selectedWarnings = {},
  onToggleWarning,
  onRemoveWarning,
}) => {
  if (!warnings || warnings.length === 0) return null;

  const selectedCount = Object.keys(selectedWarnings || {}).length;

  return (
    <section
      aria-labelledby="checkout-warnings-heading" 
      className="rounded-lg bg-gray-50 border border-gray-200 p-4 my-4"
    >
      <div className="flex items-center gap-3">
        <div
          id="checkout-warnings-heading"
          className="flex items-center gap-2 text-gray-800 font-semibold text-sm"
        >
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-white text-xs"
            aria-hidden
          >!</span>
          Нэмэлт анхааруулга
        </div>

        <div className="ml-auto text-xs text-gray-500">
          {selectedCount > 0 ? `${selectedCount} сонгогдсон` : "Сонгох"}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {warnings.map((msg) => {
          const isSelected = !!selectedWarnings?.[msg.warningId];

          return (
            <motion.div
              key={msg.warningId}
              {...minimalMotion}
              className="relative"
            >
              <Tooltip
                title={msg.warningText}
                placement="top"
                mouseEnterDelay={0.25}
              >
                <button
                  type={"button"}
                  // color={isSelected ? "default" : undefined}
                  className={`cursor-pointer select-none rounded-full px-3 py-1 text-sm font-medium transition-shadow
                    ${
                      isSelected
                        ? "bg-gray-500 text-white shadow-sm"
                        : "bg-white border border-gray-200 text-gray-700"
                    }
                    focus:outline-none focus:ring-2 focus:ring-gray-300`}
                  onClick={() =>
                    onToggleWarning(msg.warningId, msg.warningText)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onToggleWarning(msg.warningId, msg.warningText);
                    }
                  }}
                  tabIndex={0}
                  aria-pressed={isSelected}
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="truncate max-w-[240px] text-xs">
                      {msg.warningText}
                    </span>

                    {isSelected ? (
                      <Check size={14} aria-hidden className="text-white" />
                    ) : null}
                  </span>
                </button>
              </Tooltip>

              {isSelected && (
                <button
                  aria-label={`Анхааруулга устгах: ${msg.warningText}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveWarning(msg.warningId);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      onRemoveWarning(msg.warningId);
                    }
                  }}
                  className="absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white border border-gray-200 shadow text-gray-600 hover:bg-gray-50"
                >
                  <X size={12} />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {selectedCount > 0 && (
        <motion.div
          {...minimalMotion}
          className="mt-3  text-xs rounded-md bg-gray-100 border border-gray-200 px-3 py-2 text-gray-800"
        >
          <strong className="mr-2 ">{selectedCount}</strong> анхааруулга
          сонгогдсон.
        </motion.div>
      )}
    </section>
  );
};

export default CheckoutWarnings;
