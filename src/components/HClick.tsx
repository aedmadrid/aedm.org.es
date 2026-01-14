import React from "react";
import { useNavigate } from "react-router-dom";

interface HClickProps {
  texto: string;
  enlace?: string;
  icono: string;
  onClick?: (e?: React.MouseEvent<HTMLElement>) => void;
}

export const HClick: React.FC<HClickProps> = ({
  texto,
  enlace,
  icono,
  onClick,
}) => {
  const navigate = useNavigate();
  const normalizedLink = enlace?.trim();
  const isDeviceLink =
    !!normalizedLink && /^(mailto:|tel:|sms:|geo:)/i.test(normalizedLink);
  const isExternalLink =
    !!normalizedLink && /^https?:\/\//i.test(normalizedLink);

  const isInteractive = !!onClick || !!normalizedLink;

  const navigateByLink = () => {
    if (!normalizedLink) {
      return;
    }

    if (isDeviceLink) {
      window.location.href = normalizedLink;
      return;
    }

    if (isExternalLink) {
      window.open(normalizedLink, "_blank", "noopener,noreferrer");
      return;
    }

    navigate(normalizedLink);
  };

  const handleClick = (e: React.MouseEvent<HTMLHeadingElement>) => {
    onClick?.(e);

    if (e.defaultPrevented) {
      return;
    }

    navigateByLink();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLHeadingElement>) => {
    if (!isInteractive) {
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();

      if (!normalizedLink) {
        return;
      }

      navigateByLink();
    }
  };

  const headingClassName = isInteractive
    ? "hclick hclick--interactive"
    : "hclick";
  const iconClassName = "material-symbols-outlined hclick__icon";
  const textClassName = "hclick__text";

  return (
    <h3
      className={headingClassName}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      <span className={textClassName}>{texto}</span>
      <span className={iconClassName} aria-hidden="true">
        {icono}
      </span>
    </h3>
  );
};
