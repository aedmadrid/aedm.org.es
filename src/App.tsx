import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import NotFound from "./pages/NotFound";
import Inicio from "./pages/Inicio";
import { Contacto } from "./pages/Contacto";
import { Lorem } from "./pages/Lorem";
import { Asocia } from "./pages/Asocia";
import { ASOapp } from "./pages/asoApp";
import { Actividades } from "./pages/Actividades";

import { Reclama } from "./pages/Reclama";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/lorem" element={<Lorem />} />
        <Route path="/asocia" element={<Asocia />} />
        <Route path="/app" element={<ASOapp />} />
        <Route path="/actividades" element={<Actividades />} />
        <Route path="/reclama" element={<Reclama />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
