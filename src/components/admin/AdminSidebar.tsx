import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { BrandMark } from "@/components/ui/BrandMark";

const links = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/wallpapers", label: "Wallpapers" },
  { to: "/admin/collections", label: "Collections" },
];

export function AdminSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="flex h-full w-full flex-col justify-between border-r border-white/10 bg-elevated p-5 lg:w-64">
      <div>
        <div className="mb-8 flex items-center gap-2.5 px-2">
          <BrandMark size={28} />
          <span className="font-display text-base font-bold text-ink">MOONpaper</span>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-control px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-white/[0.09] text-ink" : "text-haze hover:text-ink hover:bg-white/[0.05]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-1 border-t border-white/10 pt-4">
        <NavLink to="/" className="rounded-control px-4 py-2.5 text-sm font-medium text-haze hover:text-ink">
          View site
        </NavLink>
        <button
          onClick={async () => {
            await signOut();
            navigate("/admin/login");
          }}
          className="rounded-control px-4 py-2.5 text-left text-sm font-medium text-haze hover:text-ink"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
