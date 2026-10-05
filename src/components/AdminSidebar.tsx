
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(path);
  };

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <button
        type="button"
        className="admin-mobile-menu-button"
        onClick={() => setMenuOpen(true)}
        aria-label="เปิดเมนูผู้ดูแล"
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      {menuOpen && (
        <button
          type="button"
          className="admin-mobile-overlay"
          onClick={closeMenu}
          aria-label="ปิดเมนู"
        />
      )}

      <aside
        className={`admin-sidebar ${menuOpen ? "mobile-open" : ""}`}
      >
        <div className="admin-mobile-sidebar-heading">
          <span>MENU</span>
          <button
            type="button"
            onClick={closeMenu}
            aria-label="ปิดเมนู"
          >
            ✕
          </button>
        </div>

        <div className="admin-brand">
          <div className="admin-brand-logo">HENRYNAIL</div>
          <span>ADMIN PANEL</span>
        </div>

        <nav className="admin-nav">
          <Link
            href="/admin"
            onClick={closeMenu}
            className={`admin-nav-link ${isActive("/admin") ? "active" : ""}`}
          >
            <span>Dashboard</span>
            <span>↗</span>
          </Link>

          <Link
            href="/admin/bookings"
            onClick={closeMenu}
            className={`admin-nav-link ${isActive("/admin/bookings") ? "active" : ""}`}
          >
            <span>Bookings</span>
            <span>↗</span>
          </Link>
          <Link
  href="/admin/calendar"
  onClick={closeMenu}
  className={`admin-nav-link ${isActive("/admin/calendar") ? "active" : ""}`}
>
  <span>Calendar</span>
  <span>↗</span>
</Link>

          <Link
            href="/admin/services"
            onClick={closeMenu}
            className={`admin-nav-link ${isActive("/admin/services") ? "active" : ""}`}
          >
            <span>Services</span>
            <span>↗</span>
          </Link>

          <Link
            href="/admin/gallery"
            onClick={closeMenu}
            className={`admin-nav-link ${isActive("/admin/gallery") ? "active" : ""}`}
          >
            <span>Gallery</span>
            <span>↗</span>
          </Link>

          <Link
            href="/admin/customers"
            onClick={closeMenu}
            className={`admin-nav-link ${isActive("/admin/customers") ? "active" : ""}`}
          >
            <span>Customers</span>
            <span>↗</span>
          </Link>

          <Link
            href="/admin/settings"
            onClick={closeMenu}
            className={`admin-nav-link ${isActive("/admin/settings") ? "active" : ""}`}
          >
            <span>Settings</span>
            <span>↗</span>
          </Link>

          <Link
            href="/admin/change-password"
            onClick={closeMenu}
            className={`admin-nav-link ${isActive("/admin/change-password") ? "active" : ""}`}
          >
            <span>Change Password</span>
            <span>↗</span>
          </Link>
        </nav>

        <div className="admin-sidebar-bottom">
          <Link
            href="/"
            className="admin-back-button"
            onClick={closeMenu}
          >
            ← VIEW WEBSITE
          </Link>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "LOGGING OUT..." : "LOGOUT"}
          </button>
        </div>
      </aside>
    </>
  );
}