import React from "react";
import { HClick } from "../components/HClick";

export const Proyectos: React.FC = () => {
  return (
    <main>
      <h1>Proyectos</h1>

      <HClick texto="LibrASO" enlace="/id/" icono="arrow_forward"></HClick>
      <HClick
        texto="3espacios"
        enlace="/3espacios"
        icono="arrow_forward"
      ></HClick>
    </main>
  );
};
