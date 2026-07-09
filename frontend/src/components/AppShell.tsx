import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";

export function Brand() {
  return <NavLink className="parity-brand" to="/"><img src="/jan-setu-logo.svg" alt="" aria-hidden="true" /><b>{"Jan Setu"}</b></NavLink>;
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setMenuOpen(false);
      menuToggleRef.current?.focus();
    };
    const closeOnOutside = (event: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("mousedown", closeOnOutside);
    return () => { document.removeEventListener("keydown", closeOnEscape); document.removeEventListener("mousedown", closeOnOutside); };
  }, [menuOpen]);
  const closeMenu = () => setMenuOpen(false);
  return <header className="parity-header"><div className="parity-container" ref={menuRef}>
    <Brand />
    <nav className={menuOpen ? "parity-public-nav is-open" : "parity-public-nav"} id={menuId} aria-label="Public navigation">
      <NavLink to="/#how" onClick={closeMenu}>{"How it works"}</NavLink><NavLink to="/#categories" onClick={closeMenu}>{"Categories"}</NavLink><NavLink to="/about" onClick={closeMenu}>{"About"}</NavLink>
    </nav>
    <button ref={menuToggleRef} type="button" className="parity-menu-toggle" aria-controls={menuId} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span aria-hidden="true">{menuOpen ? "×" : "☰"}</span><span className="visually-hidden">{menuOpen ? "Close navigation" : "Open navigation"}</span></button><NavLink className="parity-btn parity-teal" to="/login">{"Open the app"}</NavLink>
  </div></header>;
}

export function AppShell({ children }: { children: ReactNode }) {
  const bcp47 = "en-IN";
  return <div className="public-shell" lang={bcp47}><a className="skip-link" href="#main-content">{"Skip to content"}</a><Header />{children}<footer className="parity-footer"><div className="parity-container"><NavLink className="parity-brand" to="/"><img src="/jan-setu-logo-dark.svg" alt="" aria-hidden="true" /><b>{"Jan Setu"}</b></NavLink><p>{"A citizen-first grievance pipeline for Indian municipalities."}</p><nav aria-label="Footer navigation"><NavLink to="/about">{"About"}</NavLink><NavLink to="/login">{"Citizen sign in"}</NavLink></nav><small>© {new Date().getFullYear()} Jan Setu</small></div></footer></div>;
}

