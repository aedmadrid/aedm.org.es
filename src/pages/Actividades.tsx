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
    fetch("https://api.aedm.org.es/ACTIVIDADES_DB.json")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setActividades(data);
      })
      .catch((error) => console.error("Error fetching actividades:", error));
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const el = document.getElementById(hash);
    if (!el) return;

    const offset = 120;
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY - offset;

    window.scrollTo({ top, behavior: "smooth" });
  }, [actividades]);

  return (
    <main>
      <h1>Actividades</h1>

      <div className="containerCaratulas">
        {actividades
          .slice()
          .sort((a, b) => {
            const da = a.fecha ? Date.parse(a.fecha) : 0;
            const db = b.fecha ? Date.parse(b.fecha) : 0;
            return db - da;
          })
          .map((actividad) => {
            const fechaISO = actividad.fecha || "";
            const fechaObj = fechaISO ? new Date(fechaISO) : null;
            const meses = [
              "enero",
              "febrero",
              "marzo",
              "abril",
              "mayo",
              "junio",
              "julio",
              "agosto",
              "septiembre",
              "octubre",
              "noviembre",
              "diciembre",
            ];
            const fechaFormateada = fechaObj
              ? `${fechaObj.getDate()} de ${meses[fechaObj.getMonth()]} de ${fechaObj.getFullYear()}`
              : "";
            return (
              <Caratula
                key={actividad.destino || actividad.pageId}
                titulo={actividad.name}
                descripcion={actividad.descripcion}
                fecha={fechaFormateada}
                imagen={actividad.imagen}
                destino={actividad.destino || `/id/${actividad.pageId}`}
              />
            );
          })}
      </div>
    </main>
  );
};
