import React from "react";
import { useNavigate } from "react-router-dom";

interface CaratulaProps {
  titulo: string;
  descripcion: string;
  fecha: string;
  imagen: string;
  destino?: string;
}

export const Caratula: React.FC<CaratulaProps> = ({
  titulo,
  descripcion,
  fecha,
  imagen,
  destino,
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (destino) {
      navigate(destino);
    }
  };

  return (
    <div className="caratula">
      <img src={imagen} alt={titulo} />
      <div className="caratula-info">
        <h2>{titulo}</h2>
        <p>{descripcion}</p>
        <p>{fecha}</p>
      </div>
    </div>
  );
};
