import React, { useState } from "react";
import { NavLink } from "react-router";

interface FacebookLinkProps {
  url?: string | null;
  className?: string;
  label?: string;
}

// Usage example:
// <FacebookLink url={companyFacebookUrl} />

function FacebookLink({
  url,
  className = "",
  label = "Facebook хаягаар бидэнтэй холбогдох",
}: Readonly<FacebookLinkProps>) {
  const [copied, setCopied] = useState(false);

  const isValid = typeof url === "string" && url.trim().length > 0;
  const safeUrl = isValid ? url!.trim() : "";

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isValid) return;
    try {
      await navigator.clipboard.writeText(safeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // ignore clipboard errors silently — optionally show toast in your app
      console.error("Copy failed", err);
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-0 py-3 pr-2 rounded-lg shadow-sm bg-white ${className}`}
    >
      {/* Left: square icon */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 flex items-center justify-center rounded-md bg-blue-50">
          {/* Facebook SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fill="#1877F2"
              d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.02H8.12v-2.91h2.32V9.41c0-2.3 1.38-3.56 3.48-3.56.99 0 2.03.18 2.03.18v2.23h-1.14c-1.12 0-1.47.7-1.47 1.42v1.7h2.5l-.4 2.91h-2.1v7.02C18.34 21.2 22 17.06 22 12.07z"
            />
          </svg>
        </div>
      </div>

      {/* Right: content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate">
            <div className="text-sm font-semibold text-slate-900 truncate">
              {label}
            </div>
            <div className="text-xs text-slate-500 truncate">
              {isValid ? safeUrl : "Хаяг тохируулаагүй"}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Open button (link) */}
            <NavLink
              to={isValid ? safeUrl : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ${
                isValid
                  ? "bg-blue-600 text-white shadow"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
              aria-label={
                isValid ? `Open ${label} in a new tab` : `${label} not set`
              }
              onClick={(e) => {
                if (!isValid) e.preventDefault();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  fill="currentColor"
                  d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM19 19H5V5h6V3H5c-1.1 0-2 .9-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-6h-2v6z"
                />
              </svg>
              <span className="hidden sm:inline">Нээх</span>
            </NavLink>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              disabled={!isValid}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ${
                isValid
                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  : "bg-transparent text-slate-300 cursor-not-allowed"
              }`}
              aria-label={isValid ? `Copy ${label} URL` : `No URL to copy`}
            >
              {copied ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      fill="currentColor"
                      d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Хуулсан</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      fill="currentColor"
                      d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Хуулэх</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacebookLink;
