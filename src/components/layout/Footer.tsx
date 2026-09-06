import { Link } from "react-router-dom";
import { BrandMark, BrandWordmark } from "@/components/ui/BrandMark";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-elevated/40">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <BrandMark size={30} />
            <BrandWordmark className="text-lg" />
          </div>
          <p className="mt-3 max-w-xs text-sm text-haze">
            Premium 4K wallpapers for your desktop and mobile. Curated drops, built for every screen.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-ink">Browse</p>
          <ul className="space-y-2 text-sm text-haze">
            <li><Link to="/desktop" className="hover:text-ink">Desktop wallpapers</Link></li>
            <li><Link to="/mobile" className="hover:text-ink">Mobile wallpapers</Link></li>
            <li><Link to="/collections" className="hover:text-ink">Collections</Link></li>
            <li><Link to="/search" className="hover:text-ink">Search</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-ink">Categories</p>
          <ul className="space-y-2 text-sm text-haze">
            <li><Link to="/desktop?category=4k" className="hover:text-ink">4K</Link></li>
            <li><Link to="/desktop?category=crypto-web3" className="hover:text-ink">Crypto / Web3</Link></li>
            <li><Link to="/mobile?category=amoled" className="hover:text-ink">AMOLED</Link></li>
            <li><Link to="/desktop?category=space" className="hover:text-ink">Space</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-ink">Studio</p>
          <ul className="space-y-2 text-sm text-haze">
            <li><Link to="/admin" className="hover:text-ink">Admin dashboard</Link></li>
            <li><Link to="/terms" className="hover:text-ink">Terms and conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-ink">Privacy policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <p className="container-page text-xs text-muted">
          © {new Date().getFullYear()} MOONpaper. An original wallpaper platform, not affiliated with MoonPay.
        </p>
      </div>
    </footer>
  );
}
