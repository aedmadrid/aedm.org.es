import React from "react";
import { Botón } from "./Botón";

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
  const hoy = new Date();

  const mesesMap: Record<string, string> = {
    enero: "01",
    febrero: "02",
    marzo: "03",
    abril: "04",
    mayo: "05",
    junio: "06",
    julio: "07",
    agosto: "08",
    septiembre: "09",
    octubre: "10",
    noviembre: "11",
    diciembre: "12",
  };

  const fechaId = (() => {
    const match = fecha.match(/^(\d{1,2}) de (\w+) de (\d{4})$/);
    if (match) {
      const d = match[1].padStart(2, "0");
      const m = mesesMap[match[2]] || "00";
      const y = match[3];
      return `${d}${m}${y}`;
    }
    return "";
  })();

  const copyFechaLink: React.MouseEventHandler<HTMLHeadingElement> = (e) => {
    e.stopPropagation();
    if (!fechaId) return;
    const base = window.location.href.split("#")[0];
    const url = `${base}#${fechaId}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(
        () => console.log("copiado no sequedato"),
        () => console.log("copiado no sequedato"),
      );
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      console.log("copiado no sequedato");
    }
  };

  const matchFecha = fecha.match(/^(\d{1,2}) de (\w+) de (\d{4})$/);
  const eventoDate = (() => {
    if (matchFecha) {
      const d = parseInt(matchFecha[1], 10);
      const m = mesesMap[matchFecha[2]];
      const y = parseInt(matchFecha[3], 10);
      if (m) {
        return new Date(
          `${y}-${m}-${String(d).padStart(2, "0")}T00:00:00.000Z`,
        );
      }
    }
    return null;
  })();
  const esActivo = eventoDate ? hoy <= eventoDate : false;
  const botonTexto = esActivo ? "Ver más" : "Actividad Finalizada";
  const botonEstilo = esActivo ? "normal" : "outline";

  return (
    <div>
      <h3 id={fechaId} onClick={copyFechaLink} style={{ marginTop: 50 }}>
        {fecha}
      </h3>
      <div className="flex flex-col-reverse md:flex-row items-start gap-5 justify-between pt-5">
        <div>
          <h2>{titulo}</h2>
          <p>{descripcion}</p>
          <Botón texto={botonTexto} enlace={destino} estilo={botonEstilo} />
        </div>
        <img
          src={imagen}
          alt={titulo}
          className="w-full md:w-[300px] h-auto m-0 md:m-5"
        />
      </div>
    </div>
  );
};
