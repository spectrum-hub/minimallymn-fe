import React, { FC } from "react";
import clsx from "clsx";

/**
 * SVG Icon set (stroke-less, single-tone, currentColor)
 * Keep all icons visually balanced and consistent.
 */
export const HeartIcon: FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={clsx("w-6 h-6", className)}>
    <path
      fill="currentColor"
      d="M12 21s-6.7-4.1-9.3-7.4C.4 10.9 1.3 7.8 3.9 6.3a5 5 0 0 1 6 .8l.1.1.1-.1a5 5 0 0 1 6-.8c2.6 1.5 3.5 4.6 1.2 7.3C18.7 16.9 12 21 12 21z"
    />
  </svg>
);

export const UserIcon: FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={clsx("w-6 h-6", className)}>
    <path fill="currentColor" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5z" />
    <path fill="currentColor" d="M4 20a8 8 0 0 1 16 0v1H4z" />
  </svg>
);

export const CartIcon: FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={clsx("w-6 h-6", className)}>
    <path
      fill="currentColor"
      d="M7 20a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm9 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"
    />
    <path
      fill="currentColor"
      d="M3 3h2l2.2 10.3A2 2 0 0 0 9.2 15h7.9a2 2 0 0 0 2-1.6L21 7H6.3"
    />
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
};

export const IconStackButton: FC<IconStackButtonProps> = ({
  label,
  onClick,
  className,
  badge,
  children,
  ...rest
}) => {
  const hasBadge = typeof badge === "number" && badge > 0;
  return (
    <button
      onClick={onClick}
      className={clsx(
        "relative group inline-flex flex-col items-center justify-center",
        "px-2 py-1 min-w-[64px]",
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
                       grid place-items-center text-white bg-black/80 dark:bg-white/90 dark:text-black"
          >
            {badge}
          </span>
        )}
      </span>
      <span className="mt-[-2px] text-[11px] tracking-wide uppercase">{label}</span>
    </button>
  );
};

/* --------------------------------------------- */
/* Refactored Header action components            */
/* --------------------------------------------- */

// WishlistButton
export const WishlistButton: FC<{
  isMobile?: boolean;
  count?: number;
  onClick?: () => void;
}> = ({ isMobile, count, onClick }) => (
  <IconStackButton
    label="Хадгалсан"
    onClick={onClick}
    badge={count}
    aria-label="Wishlist"
  >
    <HeartIcon />
  </IconStackButton>
);

// UserInfoButton
export const UserInfoButton: FC<{
  isAuthenticated?: boolean;
  userName?: string | null;
  onClick?: () => void;
}> = ({ isAuthenticated, userName, onClick }) => (
  <IconStackButton
    label={isAuthenticated ? userName || "Профайл" : "Нэвтрэх"}
    onClick={onClick}
    aria-label="User"
  >
    <UserIcon />
  </IconStackButton>
);

// CartButton
export const CartButton: FC<{ totalItems?: number; onClick?: () => void }> = ({
  totalItems,
  onClick,
}) => (
  <IconStackButton
    label="Сагс"
    badge={totalItems}
    onClick={onClick}
    aria-label="Cart"
  >
    <CartIcon />
  </IconStackButton>
);
 