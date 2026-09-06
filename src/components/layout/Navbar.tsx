import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { BrandMark, BrandWordmark } from "@/components/ui/BrandMark";
import { SearchIcon, MenuIcon } from "@/components/ui/Icons";

const links = [
  { to: "/", label: "Home" },
  { to: "/desktop", label: "Desktop" },
  { to: "/mobile", label: "Mobile" },
  { to: "/collections", label: "Collections" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="glass mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between rounded-card px-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2.5">
          <BrandMark size={32} />
          <BrandWordmark className="text-lg" />
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `rounded-control px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-white/[0.09] text-ink" : "text-haze hover:text-ink hover:bg-white/[0.05]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            aria-label="Search wallpapers"
            onClick={() => navigate("/search")}
            className="flex h-10 w-10 items-center justify-center rounded-control border border-white/10 text-haze transition-colors hover:border-purple-400/50 hover:text-ink"
          >
            <SearchIcon size={17} />
          </button>

          <NavLink
            to="/admin"
            className="hidden rounded-control border border-white/10 px-4 py-2 text-sm font-medium text-haze transition-colors hover:border-purple-400/50 hover:text-ink sm:inline-flex"
          >
            Admin
          </NavLink>

          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-control border border-white/10 text-ink md:hidden"
          >
            <MenuIcon size={18} />
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={links} />
    </header>
  );
}
