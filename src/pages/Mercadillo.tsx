import React from "react";
import { GranBotón } from "../components/GranBotón";
import { HashtagScroller } from "../components/HashtagScroller";

// Hashtag data
const hashtagsRow1 = [
  "#pegatinas",
  "#llaveros",
  "#prints",
  "#fanzine",
  "#ilustración",
  "#joyería",
  "#albumilustrado",
  "#crochet",
  "#cuadernos",
  "#grabados",
  "#marcapáginas",
  "#pendientes",
  "#ropa",
  "#accesorio",
  "#aluminio",
  "#amigurumis",
];

const hashtagsRow2 = [
  "#artesanía",
  "#bisutería",
  "#bolsos",
  "#chapas",
  "#camisetas",
  "#carteles",
  "#collares",
  "#color",
  "#diy",
  "#encuadernación",
  "#fanart",
  "#fotografia",
  "#furby",
  "#handmade",
];

const hashtagsRow3 = [
  "#imanes",
  "#joyeríaenplata",
  "#láminas",
  "#madera",
  "#papelería",
  "#peluches",
  "#postales",
  "#sorpresa",
  "#decoloración",
];

// Navigation links for quick scroll
const navLinks = [
  { id: "info", label: "Información" },
  { id: "qsv", label: "¿Qué se vende?" },
  { id: "despues", label: "Después" },
  { id: "newsletter", label: "Newsletter" },
  { id: "vende", label: "Vender" },
  { id: "carteles", label: "Carteles" },
];

// Shared hashtag rows configuration
const hashtagRows = [
  { hashtags: hashtagsRow1, direction: "left" as const, duration: 25 },
  { hashtags: hashtagsRow2, direction: "right" as const, duration: 30 },
  { hashtags: hashtagsRow3, direction: "left" as const, duration: 20 },
];

export const Mercadillo: React.FC = () => {
  return (
    <main>
      {/* Hero Image */}
      <img
        src="/IMG/mercadillofinder.png"
        alt="Mercadillo de Navidad ESD Madrid"
        style={{
          width: "100%",
          height: "auto",
          marginBottom: "1rem",
        }}
      />

      {/* Title */}
      <h1
        style={{
          textAlign: "center",
          fontFamily: "PKiko, serif",
          fontSize: "2.5rem",
        }}
      >
        Mercadillo de Navidad 2025
      </h1>
      <p
        style={{
          textAlign: "center",
          marginTop: "-10px",
          marginBottom: "2rem",
        }}
      >
        Vuelve el Mercadillo de Navidad de la ESD Madrid.
      </p>

      {/* Navigation Links */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "-10px",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        {navLinks.map((link) => (
          <h2
            key={link.id}
            style={{
              fontSize: "1.25rem",
              margin: 0,
              fontFamily: "'Neue Montreal', sans-serif",
            }}
          >
            <a
              href={`#${link.id}`}
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
            >
              {link.label}
            </a>
          </h2>
        ))}
      </div>

      {/* Información */}
      <h3 id="info">Información</h3>
      <p>
        ¡Hola! Presentamos la segunda edición (desde que organiza la ASO) del
        Mercadillo de Navidad de la ESD, donde se ponen a la venta piezas de
        diseño creadas por el alumnado. En esta escuela hay mucho talento, y
        queremos que salga de estos muros. ¿Y qué mejor manera de hacerlo que
        llevándote a casa una muestra de ese talento?
      </p>
      <p>
        Por eso creemos que el Mercadillo de Navidad es la mejor oportunidad
        para mostrar al mundo lo que se crea en la ESD.
      </p>
      <p>
        Además, por primera vez, se permite la participación de exalumnos, para
        que se vea hasta donde puede llegar el talento de la ESD.
      </p>
      <p>
        <strong>
          Esto es una llamada a todo el mundo para que acuda a la ESD y se lleve
          un trocito de talento a su casa, o la casa de quien regale en fiestas.
        </strong>
      </p>
      <p>
        Añade el mercadillo a tu calendario. Es el 12 de diciembre en la Escuela
        Superior de Diseño de Madrid. De 10 a 20h.
      </p>

      <GranBotón
        texto="Añadir al calendario"
        enlace="https://www.icloud.com/invites/0a9sCfwRz72QmFiwCM5TMIJ0A"
        icono="calendar_add_on"
      />

      {/* ¿Qué se vende? */}
      <h3 id="qsv">¿Qué se vende?</h3>
      <p>Esto es lo que los vendedores nos han comunicado que venden.</p>

      <HashtagScroller rows={hashtagRows} />

      <GranBotón
        texto="Ver plano de puestos"
        enlace="/mercadillo/plano"
        icono="map"
      />

      {/* Después */}
      <h3 id="despues">Después</h3>
      <p>
        El mercadillo no acaba a las 20h. Continua con un evento de networking
        con DJ. ¡No te lo pierdas!
      </p>

      {/* Newsletter */}
      <h3 id="newsletter">Apúntate al newsletter de la ASO</h3>
      <p>No te pierdas nada de lo que pasa en la escuela.</p>

      <GranBotón
        texto="Newsletter ASO"
        enlace="https://asoesdm.substack.com/subscribe?utm_source=menu&simple=true&next=https%3A%2F%2Fwww.instagram.com/aso.esd%2F"
        icono="forward_to_inbox"
      />

      {/* ¿Quieres vender? */}
      <h3 id="vende">¿Quieres vender?</h3>
      <p>
        <strong>¿Quieres vender en el mercadillo?</strong> Hemos habilitado un
        formulario de inscripción. Revisaremos tu respuesta y te contactaremos
        lo antes posible.
      </p>
      <p>
        <strong style={{ color: "chocolate" }}>AVISO:</strong> La inscripción al
        formulario cierra el 28 de noviembre.{" "}
        <em>(Bueno, lo hemos dejado abierto de momento)</em>
      </p>

      <GranBotón
        texto="Vender en el Mercadillo 2025"
        enlace="https://aedm.notion.site/28d76f0f98e280ffbca9f8ea8d1dd94a?pvs=105"
        icono="arrow_forward"
      />

      {/* Carteles */}
      <h3 id="carteles">Carteles</h3>
      <p>
        Nos harías un gran favor si compartieras el cartel del mercadillo. Te lo
        adjuntamos.
      </p>

      <GranBotón
        texto="Descargar carteles"
        enlace="https://aedm.notion.site/Carteles-Mercadillo-2bc76f0f98e28051aee4e593b390416a?source=copy_link"
        icono="file_download"
      />
    </main>
  );
};

export default Mercadillo;
