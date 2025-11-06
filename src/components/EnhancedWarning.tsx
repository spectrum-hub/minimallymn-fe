// src/components/Products/EnhancedWarning.tsx
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircleWarningIcon } from "lucide-react";

type Props = {
  description?: string;
  className?: string;
  initiallyOpen?: boolean;
  maxPreviewLines?: number; // how many lines to show before "Дэлгэрэнгүй" appears
};

const stripFalse = (s?: string) => (!s || s === "false" ? "" : s);

export default function EnhancedWarning({
  description,
  className = "",
}: Readonly<Props>) {
  const text = stripFalse(description);

  const isEmpty = !text;
  // try to preserve basic HTML if provided (we'll inject as HTML)
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(text || "");

  // For a short preview (non-HTML) we can split by new line to display bullets
  const previewLines = useMemo(() => {
    if (!text) return [];
    if (hasHtml) return [];
    return text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
  }, [text, hasHtml]);

  if (isEmpty) return null;

  return (
    <section
      className={`relative rounded-lg p-2 px-4 border-l-4 border-gray-300 bg-gray-50 shadow-sm ${className}`}
      aria-label="Нэмэлт анхааруулга"
    >
      <div className="flex gap-3">
        <div className="flex-1">
          <h3 className="text-sm  font-semibold flex gap-2 items-center">
            <MessageCircleWarningIcon /> Санамж
          </h3>

          <AnimatePresence initial={false}>
            <motion.div
              key="open"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="mt-2 text-sm text-gray-700 leading-relaxed"
            >
              {(() => {
                if (hasHtml) {
                  return (
                    <div
                      dangerouslySetInnerHTML={{ __html: text }}
                      className="prose max-w-full prose-sm text-sm"
                    />
                  );
                }

                if (previewLines.length > 0) {
                  return (
                    <ul className="list-disc pl-5 space-y-1">
                      {previewLines.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  );
                }

                return <p>{text}</p>;
              })()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
