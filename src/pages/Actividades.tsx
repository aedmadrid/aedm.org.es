import React, { useState, useEffect } from "react";
import { Caratula } from "../components/Caratula";

interface Actividad {
  name: string;
  pageId?: string;
  destino?: string;
  icono: string;
  imagen: string;
  descripcion: string;
  fecha?: string;
}

export const Actividades = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);

  useEffect(() => {
    fetch("/ACTIVIDADES_DB.json")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setActividades(data);
      })
      .catch((error) => console.error("Error fetching actividades:", error));
  }, []);

  return (
    <main>
      <h1>Actividades</h1>

      <div className="containerCaratulas">
        {actividades.map((actividad) => (
          <Caratula
            key={actividad.destino || actividad.pageId}
            titulo={actividad.name}
            descripcion={actividad.descripcion}
            fecha={actividad.fecha || ""}
            imagen={actividad.imagen}
            destino={actividad.destino || `/actividad/${actividad.pageId}`}
          />
        ))}
      </div>
    </main>
  );
};
