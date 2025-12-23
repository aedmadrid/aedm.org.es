import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: 80,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: 20,
          paddingRight: 20,
          backgroundColor: "rgba(253, 253, 253, 0.462)",
          backdropFilter: "blur(12px)",
          zIndex: 50,
        }}
      >
        <img
          src="/adem-logo.svg"
          alt="AEDM Logo"
          style={{ height: 40, marginTop: 10, cursor: "pointer" }}
          onClick={homeUrl}
        />

        {/* NavBar Desktop - Hidden on mobile */}
        <nav
          className="navbar-nav-desktop"
          aria-label="Navegación principal"
        >
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

        {/* Mobile Menu Button - Visible only on mobile */}
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

      {/* Mobile Menu - Visible only when open on mobile */}
      {isMenuOpen && (
        <nav
          className="navbar-nav-mobile"
          aria-label="Navegación móvil"
        >
          <NavLink
            to="/"
            end
            onClick={handleNavClick}
            style={({ isActive }) => ({
              padding: "16px 20px",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              color: isActive ? "#36e452" : "inherit",
              textDecoration: isActive ? "underline" : "none",
              display: "block",
            })}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/reclama"
            onClick={handleNavClick}
            style={({ isActive }) => ({
              padding: "16px 20px",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              color: isActive ? "#36e452" : "inherit",
              textDecoration: isActive ? "underline" : "none",
              display: "block",
            })}
          >
            Expone-Solicita
          </NavLink>
          <NavLink
            to="/actividades"
            onClick={handleNavClick}
            style={({ isActive }) => ({
              padding: "16px 20px",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              color: isActive ? "#36e452" : "inherit",
              textDecoration: isActive ? "underline" : "none",
              display: "block",
            })}
          >
            Actividades
          </NavLink>
          <NavLink
            to="/proyectos"
            onClick={handleNavClick}
            style={({ isActive }) => ({
              padding: "16px 20px",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              color: isActive ? "#36e452" : "inherit",
              textDecoration: isActive ? "underline" : "none",
              display: "block",
            })}
          >
            Proyectos
          </NavLink>
          <NavLink
            to="/app"
            onClick={handleNavClick}
            style={({ isActive }) => ({
              padding: "16px 20px",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              color: isActive ? "#36e452" : "inherit",
              textDecoration: isActive ? "underline" : "none",
              display: "block",
            })}
          >
            App
          </NavLink>
          <NavLink
            to="/contacto"
            onClick={handleNavClick}
            style={({ isActive }) => ({
              padding: "16px 20px",
              color: isActive ? "#36e452" : "inherit",
              textDecoration: isActive ? "underline" : "none",
              display: "block",
            })}
          >
            Contacto
          </NavLink>
        </nav>
      )}

      {/* Mobile Menu Backdrop - Close menu on tap */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="navbar-backdrop"
        />
      )}
    </>
  );
};

export default NavBar;
