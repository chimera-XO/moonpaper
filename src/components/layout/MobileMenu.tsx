import { NavLink } from "react-router-dom";
import { BrandMark } from "@/components/ui/BrandMark";
import { CloseIcon, SearchIcon } from "@/components/ui/Icons";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: { to: string; label: string }[];
}

export function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  return (
    <div
      className={`fixed inset-0 z-50 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-void/80 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`glass-strong absolute right-3 top-3 bottom-3 w-[80%] max-w-xs rounded-card p-6 transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-[110%]"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrandMark size={26} />
            <span className="font-display text-base font-bold text-ink">Menu</span>
          </div>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-control border border-white/10 text-haze"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `rounded-control px-4 py-3 text-base font-medium ${
                  isActive ? "bg-white/[0.09] text-ink" : "text-haze"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/search"
            onClick={onClose}
            className="flex items-center gap-2 rounded-control px-4 py-3 text-base font-medium text-haze"
          >
            <SearchIcon size={16} /> Search
          </NavLink>
          <NavLink
            to="/admin"
            onClick={onClose}
            className="mt-4 rounded-control border border-white/10 px-4 py-3 text-base font-medium text-haze"
          >
            Admin
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
