import { Link } from "@remix-run/react";
import { MessageCircle, ArrowRight } from "lucide-react";
import { useState } from "react";

import { Link } from "@remix-run/react";
import { MessageCircle, ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-brand-deepPlum text-brand-ivory pt-12 pb-24 sm:pb-12 px-5 sm:px-12 border-t border-brand-plum/40">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/brand/logo.png"
                alt="Miss Malli"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-white/10 shrink-0"
              />
              <span className="font-serif italic text-3xl text-brand-ivory tracking-tight">
                miss malli
              </span>
            </Link>
            <p className="text-xs text-brand-ivory/70 leading-relaxed max-w-xs font-sans">
              Exclusive handpicked weaves, festive collections, and pure silks crafted by master artisans across India.
            </p>
            <div className="pt-1">
              <a
                href="https://wa.me/919876543210?text=Hi%20Miss%20Malli%2C%20I'd%20like%20to%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600/90 text-white text-xs font-semibold hover:bg-emerald-600 transition min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: +91 98765 43210</span>
              </a>
            </div>
          </div>

          {/* Collapsible on Mobile, Expanded on Desktop: Shop */}
          <div className="border-b border-white/10 pb-4 lg:border-none lg:pb-0 text-xs">
            <button
              onClick={() => toggleSection("shop")}
              className="w-full flex items-center justify-between font-bold text-sm tracking-wider uppercase text-brand-lilac py-2 lg:py-0 lg:cursor-default"
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
              <li><Link to="/sarees?collection=dresses" className="hover:text-brand-lilac transition block py-1">Dresses</Link></li>
              <li><Link to="/sarees?collection=materials" className="hover:text-brand-lilac transition block py-1">Dress Materials</Link></li>
              <li><Link to="/sarees?filter=sale" className="hover:text-brand-lilac transition block py-1">Festive Sale</Link></li>
            </ul>
          </div>

          {/* Collapsible on Mobile, Expanded on Desktop: Help */}
          <div className="border-b border-white/10 pb-4 lg:border-none lg:pb-0 text-xs">
            <button
              onClick={() => toggleSection("help")}
              className="w-full flex items-center justify-between font-bold text-sm tracking-wider uppercase text-brand-lilac py-2 lg:py-0 lg:cursor-default"
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
              <li><Link to="/my-requests" className="hover:text-brand-lilac transition block py-1">Track WhatsApp Order</Link></li>
              <li><Link to="/info?tab=shipping" className="hover:text-brand-lilac transition block py-1">Shipping & Delivery</Link></li>
              <li><Link to="/info?tab=returns" className="hover:text-brand-lilac transition block py-1">Returns & Exchanges</Link></li>
              <li><Link to="/info?tab=contact" className="hover:text-brand-lilac transition block py-1">FAQs</Link></li>
            </ul>
          </div>

          {/* Collapsible on Mobile, Expanded on Desktop: Company */}
          <div className="border-b border-white/10 pb-4 lg:border-none lg:pb-0 text-xs">
            <button
              onClick={() => toggleSection("company")}
              className="w-full flex items-center justify-between font-bold text-sm tracking-wider uppercase text-brand-lilac py-2 lg:py-0 lg:cursor-default"
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
              <li><Link to="/info?tab=about" className="hover:text-brand-lilac transition block py-1">Our Heritage & Artisans</Link></li>
              <li><Link to="/info?tab=contact" className="hover:text-brand-lilac transition block py-1">Contact Concierge</Link></li>
              <li><Link to="/admin" className="hover:text-brand-lilac transition block py-1">Seller Portal</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-sm tracking-wider uppercase text-brand-lilac">Newsletter</h4>
            <p className="text-brand-ivory/70 text-xs">
              Subscribe for exclusive release previews and special festive discounts.
            </p>
            {subscribed ? (
              <p className="text-brand-gold font-medium text-xs pt-1">
                ✓ Thank you for subscribing!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="relative pt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-xs text-brand-ivory placeholder:text-brand-ivory/40 focus:outline-none focus:border-brand-lilac min-h-[44px]"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-2.5 p-2 rounded-full bg-brand-plum text-white hover:bg-brand-lilac hover:text-brand-deepPlum transition min-w-[36px] min-h-[36px] flex items-center justify-center"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-brand-ivory/60">
          <p>© {new Date().getFullYear()} Miss Malli. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/info?tab=shipping" className="hover:underline py-1">Privacy Policy</Link>
            <Link to="/info?tab=returns" className="hover:underline py-1">Terms of Service</Link>
            <Link to="/admin" className="hover:underline py-1">Seller Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
