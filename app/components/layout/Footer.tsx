import { Link, useRouteLoaderData } from "@remix-run/react";
import { ChevronDown, MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { useSellerPhone } from "~/hooks/useSellerPhone";
import { WhatsAppIcon } from "~/components/ui/WhatsAppIcon";

export function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { getChatUrl } = useSellerPhone();
  const rootData = useRouteLoaderData<any>("root");

  const socials = rootData?.socialLinks || {
    instagram: "https://www.instagram.com/missmalli",
    facebook: "https://www.facebook.com/missmalli",
    youtube: "https://www.youtube.com/@missmalli",
    pinterest: "https://www.pinterest.com/missmalli",
  };

  const contactAddress = rootData?.contactAddress || "Visakhapatnam, Andhra Pradesh, India";
  const contactEmail = rootData?.contactEmail || "orders@missmalli.com";
  const contactPhone = rootData?.contactPhone || rootData?.sellerPhone || "+91 98765 43210";

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-[#FAF5F0] text-[#2A1235] pt-12 pb-24 sm:pb-12 px-5 sm:px-12 border-t border-brand-lilac/30">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Main Footer Grid - 5 Columns with Dedicated Visakhapatnam Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8">
          {/* 1. Brand Info & Social Media */}
          <div className="space-y-4 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src="/brand/logo.png"
                alt="Miss Malli"
                className="h-11 w-11 rounded-full object-cover ring-2 ring-brand-lilac/30 shrink-0"
              />
              <img
                src="/brand/logo-rect-transparent.png"
                alt="Miss Malli - Made for Her Moments"
                className="h-11 sm:h-12 w-auto object-contain shrink-0 group-hover:opacity-90 transition"
              />
            </Link>
            <p className="text-xs text-[#2A1235]/65 leading-relaxed font-sans">
              Exclusive handpicked Indian weaves, festive collections, and pure silks crafted by master artisans across India.
            </p>

            <div className="pt-1">
              <a
                href={getChatUrl("Hi Miss Malli, I would like assistance with an order")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-primary text-emerald-950 text-xs font-bold hover:bg-[#a085cc] transition min-h-[44px] shadow-sm border border-brand-primary/40 group"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" fill="#25D366" />
                <span className="text-[#15803d] font-bold">Chat on WhatsApp</span>
              </a>
            </div>

            {/* Official Social Media Channels */}
            <div className="pt-2 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#2A1235]/50 block">
                Follow Our Weaves
              </span>
              <div className="flex items-center gap-3">
                {socials.instagram && (
                  <a
                    href={socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white shadow-xs border border-brand-lilac/30 flex items-center justify-center hover:scale-110 active:scale-95 transition"
                    title="Follow on Instagram"
                    aria-label="Instagram"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <radialGradient id="footer-ig-grad" cx="0.2" cy="1" r="1">
                          <stop offset="0%" stopColor="#fdf497" />
                          <stop offset="5%" stopColor="#fdf497" />
                          <stop offset="45%" stopColor="#fd5949" />
                          <stop offset="60%" stopColor="#d6249f" />
                          <stop offset="90%" stopColor="#285AEB" />
                        </radialGradient>
                      </defs>
                      <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#footer-ig-grad)" />
                      <path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm5.2-8.4a1.17 1.17 0 11-2.34 0 1.17 1.17 0 012.34 0z" fill="#fff" />
                    </svg>
                  </a>
                )}

                {socials.facebook && (
                  <a
                    href={socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white shadow-xs border border-brand-lilac/30 flex items-center justify-center hover:scale-110 active:scale-95 transition"
                    title="Follow on Facebook"
                    aria-label="Facebook"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}

                {socials.youtube && (
                  <a
                    href={socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white shadow-xs border border-brand-lilac/30 flex items-center justify-center hover:scale-110 active:scale-95 transition"
                    title="Subscribe on YouTube"
                    aria-label="YouTube"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" fill="#FF0000"/>
                      <polygon points="9.545,15.568 15.818,12 9.545,8.432" fill="#FFFFFF"/>
                    </svg>
                  </a>
                )}

                {socials.pinterest && (
                  <a
                    href={socials.pinterest}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white shadow-xs border border-brand-lilac/30 flex items-center justify-center hover:scale-110 active:scale-95 transition"
                    title="Follow on Pinterest"
                    aria-label="Pinterest"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#BD081C" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* 2. Collapsible on Mobile, Expanded on Desktop: Shop */}
          <div className="border-b border-[#2A1235]/10 pb-4 lg:border-none lg:pb-0 text-xs">
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
              className={`space-y-2 pt-3 text-[#2A1235]/75 ${
                openSection === "shop" ? "block" : "hidden lg:block"
              }`}
            >
              <li>
                <Link to="/sarees" className="inline-block py-1 hover:text-brand-lilac hover:underline transition">
                  Sarees
                </Link>
              </li>
              <li>
                <Link to="/dresses" className="inline-block py-1 hover:text-brand-lilac hover:underline transition">
                  Dresses
                </Link>
              </li>
              <li>
                <Link to="/materials" className="inline-block py-1 hover:text-brand-lilac hover:underline transition">
                  Dress Materials
                </Link>
              </li>
              <li>
                <Link to="/exclusive" className="inline-block py-1 hover:text-brand-lilac hover:underline transition">
                  Exclusive
                </Link>
              </li>
              <li>
                <Link to="/sale" className="inline-block py-1 hover:text-brand-lilac hover:underline transition">
                  Festive Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Collapsible on Mobile, Expanded on Desktop: Help */}
          <div className="border-b border-[#2A1235]/10 pb-4 lg:border-none lg:pb-0 text-xs">
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
              className={`space-y-2 pt-3 text-[#2A1235]/75 ${
                openSection === "help" ? "block" : "hidden lg:block"
              }`}
            >
              <li>
                <Link to="/track" className="inline-block py-1 hover:text-brand-lilac hover:underline transition">
                  Track Order & Request
                </Link>
              </li>
              <li>
                <Link to="/info?tab=shipping" className="inline-block py-1 hover:text-brand-lilac hover:underline transition">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/info?tab=returns" className="inline-block py-1 hover:text-brand-lilac hover:underline transition">
                  Returns & Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Collapsible on Mobile, Expanded on Desktop: Company */}
          <div className="border-b border-[#2A1235]/10 pb-4 lg:border-none lg:pb-0 text-xs">
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
              className={`space-y-2 pt-3 text-[#2A1235]/75 ${
                openSection === "company" ? "block" : "hidden lg:block"
              }`}
            >
              <li>
                <Link to="/artisans" className="inline-block py-1 hover:text-brand-lilac hover:underline transition">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/info?tab=faq" className="inline-block py-1 hover:text-brand-lilac hover:underline transition">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* 5. Right Side: Boutique Address & Contact Details (Visakhapatnam) */}
          <div className="border-b border-[#2A1235]/10 pb-4 lg:border-none lg:pb-0 text-xs space-y-3">
            <button
              onClick={() => toggleSection("contact")}
              className="w-full flex items-center justify-between font-serif font-bold text-sm tracking-wider uppercase text-brand-lilac py-2 lg:py-0 lg:cursor-default"
            >
              <span>Boutique & Contact</span>
              <ChevronDown
                className={`w-4 h-4 lg:hidden transition-transform duration-200 ${
                  openSection === "contact" ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`space-y-3 pt-1 text-[#2A1235]/80 ${
                openSection === "contact" ? "block" : "hidden lg:block"
              }`}
            >
              {/* Address */}
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-plum shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#2A1235] block text-[11.5px]">Visakhapatnam Boutique</span>
                  <span className="text-[11px] text-[#2A1235]/70 block leading-tight">
                    {contactAddress}
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-plum shrink-0" />
                <a
                  href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                  className="inline-block text-[11.5px] font-medium hover:text-brand-plum hover:underline transition"
                >
                  {contactPhone}
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-plum shrink-0" />
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-block text-[11.5px] font-medium hover:text-brand-plum hover:underline transition"
                >
                  {contactEmail}
                </a>
              </div>

              {/* Timings */}
              <div className="flex items-start gap-2.5 pt-1 border-t border-[#2A1235]/10">
                <Clock className="w-3.5 h-3.5 text-brand-plum shrink-0 mt-0.5" />
                <span className="text-[10.5px] text-[#2A1235]/65">
                  Mon – Sun: 10:00 AM – 8:00 PM IST
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#2A1235]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#2A1235]/50">
          <p>© {new Date().getFullYear()} Miss Malli. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/info?tab=privacy" className="inline-block hover:underline py-1">Privacy Policy</Link>
            <Link to="/info?tab=terms" className="inline-block hover:underline py-1">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
