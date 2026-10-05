"use client";

import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const openBooking = () => {
    window.dispatchEvent(new Event("open-booking"));
    setMenuOpen(false);
  };

  return (
    <>
      <header className={`navbar ${menuOpen ? "menu-open" : ""}`}>
        <div className="nav-inner">

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            className="mobile-menu-button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobileMenu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
          </button>

          {/* DESKTOP NAV */}
          <nav className="nav-menu">
            <a href="#home">HOME</a>
            <a href="#about">ABOUT</a>
            <a href="#services">SERVICES</a>
            <a href="#work">WORK</a>
            <a href="#contact">CONTACT</a>
          </nav>

          {/* BOOK NOW */}
          <button
            type="button"
            className="nav-button"
            onClick={openBooking}
          >
            BOOK NOW
            <span>↗</span>
          </button>

        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`mobile-menu ${menuOpen ? "active" : ""}`}
        id="mobileMenu"
        aria-hidden={!menuOpen}
      >
        <div className="mobile-menu-inner">

          <div className="mobile-menu-top">
            <span>HENRYNAIL / MENU</span>
            <span>NAIL & STUDIO</span>
          </div>

          <nav className="mobile-nav">

            <a href="#home" onClick={closeMenu}>
              <span>01</span>
              HOME
              <b>↗</b>
            </a>

            <a href="#about" onClick={closeMenu}>
              <span>02</span>
              ABOUT
              <b>↗</b>
            </a>

            <a href="#services" onClick={closeMenu}>
              <span>03</span>
              SERVICES
              <b>↗</b>
            </a>

            <a href="#work" onClick={closeMenu}>
              <span>04</span>
              WORK
              <b>↗</b>
            </a>

            <a href="#contact" onClick={closeMenu}>
              <span>05</span>
              CONTACT
              <b>↗</b>
            </a>

          </nav>

          <button
            type="button"
            className="mobile-booking-button"
            onClick={openBooking}
          >
            BOOK YOUR APPOINTMENT
            <span>↗</span>
          </button>

          <div className="mobile-menu-footer">
            <span>ต.ป่างิ้ว · เชียงราย</span>
            <span>EST. 3 YEARS</span>
          </div>

        </div>
      </div>
    </>
  );
}