import { FC } from "react";
import { FooterBlock } from "../../types/Blocks";

interface FooterProps {
  footerData?: FooterBlock | null;
}

/**
 * Minimal Zara/Apple-style footer
 * - Small, subtle gray background
 * - Compact typography, muted colors
 * - Smooth hover effects
 * - Centered on mobile, spread on desktop
 * 
 * Дэлгүүрийн цагийн хуваарь: 
Өдөр бүр 10:00-18:30
🏠: Нарны замын Доктор болон Миний дэлгүүр 2-ын дунд Luxhouse-5 Худалдааны төвийн 2 давхарт
☎️: 8043-1000, 8042-1000
 Та бүхэн цахим залилангаас сэргийлж зөвхөн пэйж дээр байгаа утсаар болон чатаар захиалгаа өгөөрэй. Баярлалаа
 */
const FooterComponent: FC<FooterProps> = () => {
  return (
    <footer className="w-full bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 text-xs md:text-sm border-t border-neutral-200 dark:border-neutral-800 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-12">
          {/* Logo */}
          <div className="flex-shrink-0 flex justify-center md:justify-start">
            <a href="/" aria-current="page" className="inline-block">
              <img
                src="/logo.png"
                alt="Minimally Logo"
                className="h-8 md:h-14 opacity-80 hover:opacity-100 transition duration-300"
              />
            </a>
          </div>

          {/* About */}
          <div className="max-w-sm text-center md:text-left">
            <h2 className="mb-2 font-medium text-neutral-800 dark:text-neutral-100 text-sm">
              Бидний тухай
            </h2>
            <p className="leading-relaxed text-[13px]">
              Бид танд бараа бүтээгдэхүүнийг төлбөрийн олон төрлийн нөхцөлөөр
              илүү хялбараар худалдан авах боломжийг олгож байна.
            </p>
          </div>

          {/* Contact */}
          <div className="max-w-sm text-center md:text-left">
            <h2 className="mb-2 font-medium text-neutral-800 dark:text-neutral-100 text-sm">
              Холбоо барих
            </h2>
            <ul className="space-y-1 text-[13px] leading-6">
              <li>
                <span className="font-medium">Утас:</span> 8043-1000, 8042-1000
              </li>
              <li>
                <span className="font-medium">Цагийн хуваарь:</span> Өдөр бүр
                10:00 - 18:30{" "}
              </li>
              <li>
                <span className="font-medium">Цахим шуудан:</span>{" "}
                sales@minimally.mn
              </li>
              <li>
                <span className="font-medium">Хаяг:</span> Нарны замын Доктор
                болон Миний дэлгүүр 2-ын дунд Luxhouse-5 Худалдааны төвийн 2
                давхарт
              </li>
              <li className="italic opacity-80">Minimally -тай ХАМТ</li>
            </ul>

            {/* Social */}
            <div className="flex justify-center md:justify-start mt-4 gap-3">
              <a
                href="https://www.facebook.com/minimally.mn"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition"
              >
                <img
                  src="/images/facebook.png"
                  alt="facebook.com"
                  className="h-5"
                />
              </a>
              <a
                href="https://www.instagram.com/minimally_official/"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition"
              >
                <img
                  src="/images/instagram.png"
                  alt="instagram.com"
                  className="h-5"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-neutral-200 dark:border-neutral-800 pt-4 text-center text-[12px] text-neutral-500 dark:text-neutral-400">
          © {new Date().getFullYear()} Minimally. Бүх эрх хуулиар хамгаалагдсан.
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
