import { Link } from "@remix-run/react";
import { MessageCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useSellerPhone } from "~/hooks/useSellerPhone";

export function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { getChatUrl } = useSellerPhone();

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-brand-deepPlum text-brand-ivory pt-12 pb-24 sm:pb-12 px-5 sm:px-12 border-t border-brand-plum/40">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Main Footer Grid - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src="/brand/logo.png"
                alt="Miss Malli"
                className="h-11 w-11 rounded-full object-cover ring-2 ring-brand-lilac/30 shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-serif italic text-2xl text-brand-ivory tracking-tight leading-none">
                  miss malli
                </span>
                <span className="font-serif italic text-[10px] tracking-widest text-brand-lilac/80 uppercase mt-1">
                  Made for Her Moments
                </span>
              </div>
            </Link>
            <p className="text-xs text-brand-ivory/70 leading-relaxed max-w-xs font-sans">
              Exclusive handpicked weaves, festive collections, and pure silks crafted by master artisans across India.
            </p>
            <div className="pt-1">
              <a
                href={getChatUrl("Hi Miss Malli, I would like assistance with an order")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600/90 text-white text-xs font-semibold hover:bg-emerald-600 transition min-h-[44px] shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Collapsible on Mobile, Expanded on Desktop: Shop */}
          <div className="border-b border-white/10 pb-4 lg:border-none lg:pb-0 text-xs">
            <button
              onClick={() => toggleSection("shop")}
              className="w-full flex items-center justify-between font-serif font-bold text-sm tracking-wider uppercase text-brand-lilac py-2 lg:py-0 lg:cursor-default"
            >
              <span>Shop</span>
              <ChevronDown
                className={`w-4 h-4 lg:hidden transition-transform duration-200 ${
                  openSection === "shop" ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`space-y-3 pt-3 text-brand-ivory/80 ${
                openSection === "shop" ? "block" : "hidden lg:block"
              }`}
            >
              <li><Link to="/sarees" className="hover:text-brand-lilac transition block py-1">Sarees</Link></li>
              <li><Link to="/dresses" className="hover:text-brand-lilac transition block py-1">Dresses</Link></li>
              <li><Link to="/materials" className="hover:text-brand-lilac transition block py-1">Dress Materials</Link></li>
              <li><Link to="/exclusive" className="hover:text-brand-lilac transition block py-1">Exclusive</Link></li>
              <li><Link to="/sale" className="hover:text-brand-lilac transition block py-1">Festive Sale</Link></li>
            </ul>
          </div>

          {/* Collapsible on Mobile, Expanded on Desktop: Help */}
          <div className="border-b border-white/10 pb-4 lg:border-none lg:pb-0 text-xs">
            <button
              onClick={() => toggleSection("help")}
              className="w-full flex items-center justify-between font-serif font-bold text-sm tracking-wider uppercase text-brand-lilac py-2 lg:py-0 lg:cursor-default"
            >
              <span>Help & Service</span>
              <ChevronDown
                className={`w-4 h-4 lg:hidden transition-transform duration-200 ${
                  openSection === "help" ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`space-y-3 pt-3 text-brand-ivory/80 ${
                openSection === "help" ? "block" : "hidden lg:block"
              }`}
            >
              <li><Link to="/track" className="hover:text-brand-lilac transition block py-1">Track Order & Request</Link></li>
              <li><Link to="/info?tab=shipping" className="hover:text-brand-lilac transition block py-1">Shipping & Delivery</Link></li>
              <li><Link to="/info?tab=returns" className="hover:text-brand-lilac transition block py-1">Returns & Exchanges</Link></li>
              <li><Link to="/info?tab=contact" className="hover:text-brand-lilac transition block py-1">Studio & FAQs</Link></li>
            </ul>
          </div>

          {/* Collapsible on Mobile, Expanded on Desktop: Company */}
          <div className="border-b border-white/10 pb-4 lg:border-none lg:pb-0 text-xs">
            <button
              onClick={() => toggleSection("company")}
              className="w-full flex items-center justify-between font-serif font-bold text-sm tracking-wider uppercase text-brand-lilac py-2 lg:py-0 lg:cursor-default"
            >
              <span>About Malli</span>
              <ChevronDown
                className={`w-4 h-4 lg:hidden transition-transform duration-200 ${
                  openSection === "company" ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`space-y-3 pt-3 text-brand-ivory/80 ${
                openSection === "company" ? "block" : "hidden lg:block"
              }`}
            >
              <li><Link to="/artisans" className="hover:text-brand-lilac transition block py-1">Our Heritage & Artisans</Link></li>
              <li><Link to="/info?tab=about" className="hover:text-brand-lilac transition block py-1">Our Story</Link></li>
              <li><Link to="/info?tab=contact" className="hover:text-brand-lilac transition block py-1">Contact Concierge</Link></li>
              <li><Link to="/admin" className="hover:text-brand-lilac transition block py-1">Seller Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-brand-ivory/60">
          <p>© {new Date().getFullYear()} Miss Malli. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/info?tab=privacy" className="hover:underline py-1">Privacy Policy</Link>
            <Link to="/info?tab=terms" className="hover:underline py-1">Terms of Service</Link>
            <Link to="/admin" className="hover:underline py-1">Seller Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
