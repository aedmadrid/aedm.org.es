import React from "react";
import { useNavigate } from "react-router-dom";

interface BotónProps {
  texto: string;
  enlace?: string;
  icono: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

export const GranBotón: React.FC<BotónProps> = ({
  texto,
  enlace,
  icono,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
    if (enlace?.startsWith("http")) {
      window.open(enlace, "_blank", "noopener,noreferrer");
    } else if (enlace) {
      navigate(enlace);
    }
  };

  return (
    <button
      type="button"
      style={{
        padding: 18,
        width: "100%",
        backgroundColor: "#36e452",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onClick={handleClick}
    >
      <p style={{ fontFamily: "PKiko", fontSize: 23, margin: 0 }}>{texto}</p>
      <span className="material-symbols-outlined">{icono}</span>
    </button>
  );
};
