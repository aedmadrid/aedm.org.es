import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";
import Inicio from "./pages/Inicio";
import { Contacto } from "./pages/Contacto";
import { Lorem } from "./pages/Lorem";
import { Asocia } from "./pages/Asocia";
import { ASOapp } from "./pages/asoApp";
import { Actividades } from "./pages/Actividades";
import { Proyectos } from "./pages/Proyectos";
import { Reclama } from "./pages/Reclama";
import { Mercadillo } from "./pages/Mercadillo";
import { MercadilloPlano } from "./pages/MercadilloPlano";
import { Footer } from "./components/footer";
import CookieConsent from "react-cookie-consent";
import { TresEspacios } from "./pages/3espacios.notion";
import { Museaso } from "./pages/museaso.notion";
import PrivApp from "./pages/PrivApp";
import { FiestAso } from "./pages/fiestaso.notion";
function App() {
  const isAsoApp = navigator.userAgent.includes("ASO.app 2");

  return (
    <BrowserRouter>
      <ScrollToTop />
      {!isAsoApp && <NavBar />}
      {!isAsoApp && (
        <CookieConsent
          location="bottom"
          buttonText="Aceptar"
          cookieName="cookieConsent"
          style={{ background: "#2B373B", color: "#fff" }}
          buttonStyle={{
            color: "black",
            fontSize: "14px",
            background: "rgb(54, 228, 82)",
          }}
        >
          Este sitio web utiliza cookies y Google Analytics para mejorar su
          experiencia. Al continuar navegando, acepta el uso de estas
          tecnologías.
        </CookieConsent>
      )}
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/lorem" element={<Lorem />} />
        <Route path="/asocia" element={<Asocia />} />
        <Route path="/app" element={<ASOapp />} />
        <Route path="/actividades" element={<Actividades />} />
        <Route path="/reclama" element={<Reclama />} />
        <Route path="/mercadillo" element={<Mercadillo />} />
        <Route path="/mercadillo/plano" element={<MercadilloPlano />} />
        <Route path="/proyectos" element={<Proyectos />} />
        <Route path="/3espacios" element={<TresEspacios />} />
        <Route path="/museaso" element={<Museaso />} />
        <Route path="/privapp" element={<PrivApp />} />
        <Route path="/fiestaso" element={<FiestAso />} />
      </Routes>
      {!isAsoApp && <Footer />}
    </BrowserRouter>
  );
}

export default App;
