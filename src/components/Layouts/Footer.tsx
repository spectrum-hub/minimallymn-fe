import { FC } from "react";
import { ThemeGrid } from "../../types";
import RenderHtml from "../RenderHtml";
import { NavLink } from "react-router";

interface FooterProps {
  themeGrid?: ThemeGrid | null;
}

const FooterComponent: FC<FooterProps> = ({ themeGrid }) => {
  return (
    <footer className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      {/* Main footer content */}
      <div className="relative">
        {/* Background pattern overlay */}
        <div className="absolute inset-0 "></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <a href="/" className="inline-block group">
                <img
                  src="/assets/footer_white_logo.png"
                  alt="Minimally Logo"
                  className="h-12 lg:h-16 w-auto filter brightness-0 invert transition-all duration-300 group-hover:scale-105"
                />
              </a>

              <div className="max-w-md">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Бидний тухай
                </h3>
                <RenderHtml
                  text={themeGrid?.companyDescription}
                  className="text-sm leading-relaxed text-gray-400"
                />
              </div>

              {/* Social Media */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-white">
                  Бидэнтэй хамт:
                </span>
                <div className="flex space-x-3">
                  <a
                    href={themeGrid?.facebookUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600/20 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                    aria-label="Facebook хуудас"
                  >
                    <svg
                      className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.2V12h2.2V9.8c0-2.2 1.3-3.4 3.3-3.4.95 0 1.9.17 1.9.17v2.1h-1.1c-1 0-1.3.63-1.3 1.3V12h2.2l-.35 2.9h-1.85v7A10 10 0 0 0 22 12Z" />
                    </svg>
                  </a>
                  <a
                    href={themeGrid?.instagramUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-pink-600/20 hover:bg-pink-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                    aria-label="Instagram хуудас"
                  >
                    <svg
                      className="w-5 h-5 text-pink-400 group-hover:text-white transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.2A2.8 2.8 0 1 0 12 17.8 2.8 2.8 0 0 0 12 9.2Zm5.55-1.65a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Холбоо барих</h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-white">Утас</p>

                    <RenderHtml
                      text={themeGrid?.contactPhone}
                      className="text-sm text-gray-400"
                    />
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Цагийн хуваарь
                    </p>
                    <RenderHtml
                      text={themeGrid?.timetable}
                      className="text-sm text-gray-400"
                    />
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Цахим шуудан
                    </p>
                    <a
                      href={`mailto:${themeGrid?.contactEmail}`}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {themeGrid?.contactEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Хаяг</h3>

              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <RenderHtml
                    text={themeGrid?.address}
                    className="text-sm text-gray-400"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl border border-blue-600/20">
                <p className="text-sm font-medium text-blue-300 italic">
                  Minimally -тай ХАМТ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} {themeGrid?.copyrightText}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {themeGrid?.pages?.map((page) => (
                <NavLink
                  key={page.pageId}
                  to={`/pages/${page.pageSlug}`}
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}
                >
                  {page.pageName}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
