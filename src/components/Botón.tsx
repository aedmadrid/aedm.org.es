import React from "react";
import { useNavigate } from "react-router-dom";

interface BotónProps {
  texto: string;
  enlace?: string;
  estilo?: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Botón: React.FC<BotónProps> = ({
  texto,
  enlace,
  estilo = "normal",
  onClick,
}) => {
  const navigate = useNavigate();

  // Mapeo de estilos
  const estilosBoton: Record<string, React.CSSProperties> = {
    negro: {
      backgroundColor: "#040406",
      color: "#ffffff",
      border: "none",
    },
    normal: {
      backgroundColor: "#36e452",
      color: "#000000",
      border: "none",
    },
    outline: {
      border: "1px solid #36e452",
      backgroundColor: "transparent",
      color: "#36e452",
    },
  };

  // Obtener el estilo correspondiente o usar el normal por defecto
  const estiloSeleccionado = estilosBoton[estilo] || estilosBoton.normal;

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
        padding: 10,
        width: "100%",
        cursor: "pointer",
        fontSize: 16,
        fontWeight: 500,
        transition: "all 0.2s ease",
        ...estiloSeleccionado,
      }}
      onClick={handleClick}
    >
      {texto}
    </button>
  );
};
