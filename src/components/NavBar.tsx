import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

const GA_MEASUREMENT_ID = "G-BKX38RNZGX";

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Google Analytics gtag.js
  useEffect(() => {
    // Check if script is already loaded
    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
      return;
    }

    // Load gtag.js async script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID);
  }, []);

  const activeStyle = {
    color: "#36e452",
    textDecoration: "underline",
  } as React.CSSProperties;

  const navigate = useNavigate();
  function homeUrl() {
    navigate("/");
    setIsMenuOpen(false);
  }

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="navbar-container">
        <img
          src="/aedm.svg"
          alt="AEDM Logo"
          style={{ height: 40, marginTop: 10, cursor: "pointer" }}
          onClick={homeUrl}
        />

        {/* NavBar Desktop  */}
        <nav className="navbar-nav-desktop" aria-label="Navegación principal">
          <NavLink
            to="/"
            end
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/reclama"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            Expone-Solicita
          </NavLink>
          <NavLink
            to="/actividades"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            Actividades
          </NavLink>
          <NavLink
            to="/proyectos"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            Proyectos
          </NavLink>
          <NavLink
            to="/app"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            App
          </NavLink>
          <NavLink
            to="/contacto"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            Contacto
          </NavLink>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="navbar-menu-btn"
          aria-label="Abrir menú de navegación"
        >
          <span className="material-symbols-outlined">
            {isMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div onClick={() => setIsMenuOpen(false)} className="navbar-backdrop">
          <nav className="navbar-nav-mobile" aria-label="Navegación móvil">
            <NavLink
              to="/"
              end
              onClick={handleNavClick}
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
            >
              Inicio
            </NavLink>
            <NavLink
              to="/reclama"
              onClick={handleNavClick}
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
            >
              Expone-Solicita
            </NavLink>
            <NavLink
              to="/actividades"
              onClick={handleNavClick}
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
            >
              Actividades
            </NavLink>
            <NavLink
              to="/proyectos"
              onClick={handleNavClick}
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
            >
              Proyectos
            </NavLink>
            <NavLink
              to="/app"
              onClick={handleNavClick}
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
            >
              App
            </NavLink>
            <NavLink
              to="/contacto"
              onClick={handleNavClick}
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
            >
              Contacto
            </NavLink>
          </nav>
        </div>
      )}
    </>
  );
};

export default NavBar;
