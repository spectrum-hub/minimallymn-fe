import React, { FC } from "react";
import clsx from "clsx";

/**
 * SVG Icon set (stroke-less, single-tone, currentColor)
 * Keep all icons visually balanced and consistent.
 */
export const HeartIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden
    className={clsx("w-6 h-6", className)}
    fill="none"
  >
    <path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const UserIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden
    className={clsx("w-6 h-6", className)}
    fill="none"
  >
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M6 20.5c0-4.4 2.7-8 6-8s6 3.6 6 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const CartIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden
    className={clsx("w-6 h-6", className)}
    fill="none"
  >
    <path
      d="M3 3h2l1.68 10.39A2 2 0 0 0 8.65 15h8.7A2 2 0 0 0 19.3 13.39L21 6H6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="19" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="19" r="1.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const PhoneIcon: FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={clsx("w-5 h-5", className)}>
    <path
      fill="currentColor"
      d="M6.6 2h2.3a2 2 0 0 1 2 1.7l.4 2.6a2 2 0 0 1-1.2 2.1l-1.5.7a12.8 12.8 0 0 0 5.8 5.8l.7-1.5a2 2 0 0 1 2.1-1.2l2.6.4a2 2 0 0 1 1.7 2v2.3a2 2 0 0 1-2 2.1 18 18 0 0 1-17-17A2 2 0 0 1 6.6 2Z"
    />
  </svg>
);

export const SendIcon: FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={clsx("w-5 h-5", className)}>
    <path
      fill="currentColor"
      d="M3.4 20.6 22 12 3.4 3.4 4.9 11l10.1 1-10.1 1z"
    />
  </svg>
);

/* --------------------------------------------- */
/* Unified stacked button: icon above, text below */
/* --------------------------------------------- */

type IconStackButtonProps = {
  label: string;
  onClick?: () => void;
  className?: string;
  badge?: number;
  "aria-label"?: string;
  children: React.ReactNode; // SVG
  labelShow?: boolean; // whether to show label text
};

export const IconStackButton: FC<IconStackButtonProps> = ({
  label,
  onClick,
  className,
  badge,
  children,
  labelShow,
  ...rest
}) => {
  const hasBadge = typeof badge === "number" && badge > 0;
  return (
    <button
      onClick={onClick}
      className={clsx(
        "relative group inline-flex flex-col items-center justify-center",
        "px-1 py-1 ",
         "min-w-[30px]",
        // unified color + effects
        "text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white",
        "transition-colors duration-200",
        className
      )}
      {...rest}
    >
      <span
        className={clsx(
          "relative grid place-items-center rounded-full",
          "h-8 w-8",
          // subtle hover background
          "group-hover:bg-black/5 dark:group-hover:bg-white/10",
          "transition-colors"
        )}
      >
        {children}
        {hasBadge && (
          <span
            className="absolute -top-1 -right-1 text-[11px] font-bold w-4 h-4 rounded-full
                       grid place-items-center text-white bg-black/80 dark:bg-white/90 
                       dark:text-black"
          >
            {badge}
          </span>
        )}
      </span>
      {labelShow ? (
        <span className="mt-[-2px] text-[11px] tracking-wide uppercase">
          {label}
        </span>
      ) : null}
    </button>
  );
};

/* --------------------------------------------- */
/* Refactored Header action components            */
/* --------------------------------------------- */

// WishlistButton
export const WishlistButton: FC<{
  count?: number;
  onClick?: () => void;
  isMobile?: boolean;
}> = ({ count, onClick, isMobile }) => (
  <IconStackButton
    label="Хадгалсан"
    onClick={onClick}
    badge={count}
    aria-label="Wishlist"
    labelShow={isMobile}
  >
    <HeartIcon />
  </IconStackButton>
);

// UserInfoButton
export const UserInfoButton: FC<{
  isAuthenticated?: boolean;
  userName?: string | null;
  isMobile?: boolean;
  onClick?: () => void;
}> = ({ isAuthenticated, userName, onClick, isMobile }) => (
  <IconStackButton
    label={isAuthenticated ? userName || "Профайл" : "Нэвтрэх"}
    onClick={onClick}
    aria-label="User"
    labelShow={isMobile}
  >
    <UserIcon />
  </IconStackButton>
);

// CartButton
export const CartButton: FC<{
  totalItems?: number;
  onClick?: () => void;
  isMobile?: boolean;
}> = ({ totalItems, onClick, isMobile }) => (
  <IconStackButton
    label="Сагс"
    badge={totalItems}
    onClick={onClick}
    aria-label="Cart"
    labelShow={isMobile}
  >
    <CartIcon />
  </IconStackButton>
);
