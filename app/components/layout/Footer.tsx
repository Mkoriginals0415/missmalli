import { Link } from "@remix-run/react";
import { MessageCircle, ArrowRight } from "lucide-react";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-brand-deepPlum text-brand-ivory pt-16 pb-12 px-6 sm:px-12 border-t border-brand-plum/40">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif italic text-3xl text-brand-ivory tracking-tight">
                miss malli
              </span>
            </Link>
            <p className="text-xs text-brand-ivory/70 leading-relaxed max-w-xs font-sans">
              Heritage drapes, woven with love and delivered across India. Handpicked authentic weaves from master artisans.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/919876543210?text=Hi%20Miss%20Malli%2C%20I'd%20like%20to%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600/90 text-white text-xs font-medium hover:bg-emerald-600 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: +91 98765 43210</span>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-sm tracking-wider uppercase text-brand-lilac">Shop</h4>
            <ul className="space-y-2.5 text-brand-ivory/80">
              <li><Link to="/sarees" className="hover:text-brand-lilac transition">Sarees</Link></li>
              <li><Link to="/sarees?collection=dresses" className="hover:text-brand-lilac transition">Dresses</Link></li>
              <li><Link to="/sarees?collection=materials" className="hover:text-brand-lilac transition">Dress Materials</Link></li>
              <li><Link to="/sarees?filter=sale" className="hover:text-brand-lilac transition">Sale</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-sm tracking-wider uppercase text-brand-lilac">Help</h4>
            <ul className="space-y-2.5 text-brand-ivory/80">
              <li><Link to="/my-requests" className="hover:text-brand-lilac transition">Track Order</Link></li>
              <li><Link to="/info?tab=shipping" className="hover:text-brand-lilac transition">Shipping</Link></li>
              <li><Link to="/info?tab=returns" className="hover:text-brand-lilac transition">Returns</Link></li>
              <li><Link to="/info?tab=contact" className="hover:text-brand-lilac transition">FAQs</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-sm tracking-wider uppercase text-brand-lilac">Company</h4>
            <ul className="space-y-2.5 text-brand-ivory/80">
              <li><Link to="/info?tab=about" className="hover:text-brand-lilac transition">Our Artisans</Link></li>
              <li><Link to="/info?tab=contact" className="hover:text-brand-lilac transition">Contact</Link></li>
              <li><Link to="/admin" className="hover:text-brand-lilac transition">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-sm tracking-wider uppercase text-brand-lilac">Newsletter</h4>
            <p className="text-brand-ivory/70 text-xs">
              Subscribe to receive exclusive festive saree releases & artisan previews.
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
                  placeholder="Your email →"
                  className="w-full px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-xs text-brand-ivory placeholder:text-brand-ivory/40 focus:outline-none focus:border-brand-lilac"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-2.5 p-1.5 rounded-full bg-brand-plum text-white hover:bg-brand-lilac hover:text-brand-deepPlum transition"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-brand-ivory/50">
          <p>© {new Date().getFullYear()} Miss Malli. All rights reserved. Handwoven with love.</p>
          <div className="flex items-center gap-6">
            <Link to="/info?tab=shipping" className="hover:underline">Privacy Policy</Link>
            <Link to="/info?tab=returns" className="hover:underline">Terms of Service</Link>
            <Link to="/admin" className="hover:underline">Seller Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
