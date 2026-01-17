import React from "react";
import { Botón } from "../components/Botón";
import { SubstackFeed } from "../components/SubstackFeed";

const Inicio: React.FC = () => {
  return (
    <main>
      <img
        src="/IMG/bannermobile.png"
        alt="Logo"
        style={{ width: "100%", height: "auto", paddingBottom: 20 }}
      />
      <h1 style={{ justifyContent: "left", textAlign: "left" }}>¡Hola!</h1>
      <p>
        Somos la asociación de estudiantes de la{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://esdmadrid.es"
          style={{ color: "#36e452", textDecoration: "underline" }}
        >
          Escuela Superior de Diseño de Madrid
        </a>{" "}
        (ESD).
      </p>
      <p>Abajo tienes el enlace para ser soci@.</p>
      <Botón
        enlace="https://www.instagram.com/aso.esd/"
        texto="Instagram"
        estilo="outline"
      />
      <Botón
        enlace="https://whatsapp.com/channel/0029VayuAlmISTkHVLfCc021"
        texto="WhatsApp"
        estilo="outline"
      />
      <Botón enlace="/asocia" texto="ASÓciate" />

      <section style={{ marginTop: "2rem" }}>
        <h2 style={{ marginBottom: "0.5rem", textAlign: "left" }}>Novedades</h2>
        <SubstackFeed maxPosts={9} />
      </section>
    </main>
  );
};

export default Inicio;
