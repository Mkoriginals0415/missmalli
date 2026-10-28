import { useState } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link, Outlet, useLocation } from "@remix-run/react";
import { 
  Inbox, 
  Package, 
  FolderTree, 
  LayoutTemplate,
  Settings as SettingsIcon, 
  ExternalLink,
  Store,
  Menu,
  X
} from "lucide-react";
import { getAllRequests } from "~/db/d1.server";

export async function loader({ context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const requests = await getAllRequests(env);
  const needsReplyCount = requests.filter((r) => r.status === "needs_reply").length;

  return json({
    needsReplyCount,
  });
}

export default function AdminLayout() {
  const { needsReplyCount } = useLoaderData<typeof loader>();
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navItems = [
    { label: "Requests", to: "/admin", icon: Inbox, badge: needsReplyCount },
    { label: "Homepage Editor", to: "/admin/homepage", icon: LayoutTemplate },
    { label: "Products & Stock", to: "/admin/products", icon: Package },
    { label: "Collections", to: "/admin/collections", icon: FolderTree },
    { label: "Settings & Colors", to: "/admin/settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-brand-deepPlum flex flex-col md:flex-row font-sans">
      {/* -------------------------------------------------------------
          MOBILE ADMIN TOP HEADER (Unified Sticky Navigation)
         ------------------------------------------------------------- */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-brand-deepPlum/15 shadow-xs">
        {/* Top bar with mathematically centered logo */}
        <div className="px-3 py-2 flex items-center justify-between border-b border-brand-deepPlum/10 relative">
          {/* Left: Mobile Drawer Hamburger */}
          <div className="flex items-center justify-start w-12 shrink-0">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 text-brand-deepPlum hover:text-brand-plum rounded-lg min-w-[40px] min-h-[40px] flex items-center justify-center relative active:scale-95 transition"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-5 h-5 stroke-[2.2]" />
              {needsReplyCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-plum ring-2 ring-white" />
              )}
            </button>
          </div>

          {/* Center: Perfectly Centered Brand Logo & Admin Pill */}
          <div className="flex-1 flex items-center justify-center min-w-0">
            <Link to="/admin" className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-brand-deepPlum/5 transition">
              <img
                src="/brand/logo.png"
                alt="Miss Malli"
                className="h-7 w-7 rounded-full object-cover ring-1 ring-brand-deepPlum/15 shrink-0 shadow-2xs"
              />
              <div className="flex flex-col items-start leading-tight">
                <span className="font-serif font-bold text-[12.5px] tracking-wide text-brand-deepPlum">
                  MISS MALLI
                </span>
                <span className="text-[8.5px] tracking-widest uppercase font-extrabold text-brand-plum">
                  ADMIN PORTAL
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Quick Link to Public Store */}
          <div className="flex items-center justify-end w-12 shrink-0">
            <Link
              to="/"
              target="_blank"
              className="p-2 rounded-lg text-brand-deepPlum/70 hover:text-brand-plum min-w-[40px] min-h-[40px] flex items-center justify-center active:scale-95 transition"
              title="View Live Store"
              aria-label="View Customer Store"
            >
              <Store className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Horizontal quick tabs */}
        <div className="bg-[#FAF8F5] px-3 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.to === "/admin" 
              ? currentPath === "/admin" || currentPath === "/admin/"
              : currentPath.startsWith(item.to);

            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap shrink-0 transition min-h-[36px] ${
                  isActive
                    ? "bg-brand-deepPlum text-white shadow-xs"
                    : "bg-white text-brand-deepPlum/75 hover:bg-brand-deepPlum/10 border border-brand-deepPlum/10"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-brand-plum text-white"
                  }`}>
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </header>

      {/* -------------------------------------------------------------
          MOBILE SLIDE-OVER DRAWER
         ------------------------------------------------------------- */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-brand-deepPlum/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 w-[80%] max-w-xs bg-white shadow-2xl z-10 flex flex-col justify-between overflow-y-auto border-r border-brand-deepPlum/15 animate-in slide-in-from-left duration-200">
            <div>
              <div className="p-4 flex items-center justify-between border-b border-brand-deepPlum/10">
                <div className="flex items-center gap-2.5">
                  <img src="/brand/logo.png" alt="Miss Malli" className="h-9 w-9 rounded-full object-cover ring-1 ring-brand-deepPlum/15 shadow-2xs" />
                  <div>
                    <span className="font-serif font-bold text-sm tracking-wide text-brand-deepPlum block leading-tight">
                      MISS MALLI
                    </span>
                    <span className="text-[9.5px] tracking-widest uppercase font-extrabold text-brand-plum block">
                      SELLER ADMIN
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-2 -mr-2 text-brand-deepPlum rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <X className="w-5 h-5 stroke-[2.2]" />
                </button>
              </div>

              <nav className="p-4 space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.to === "/admin" 
                    ? currentPath === "/admin" || currentPath === "/admin/"
                    : currentPath.startsWith(item.to);

                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition min-h-[44px] ${
                        isActive
                          ? "bg-brand-deepPlum text-white shadow-sm"
                          : "text-brand-deepPlum/80 hover:bg-brand-ivory"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 stroke-[2.2]" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && item.badge > 0 ? (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive ? "bg-brand-plum text-white" : "bg-brand-plum text-white"
                        }`}>
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 border-t border-brand-deepPlum/10 space-y-2 bg-brand-ivory/40">
              <Link
                to="/"
                target="_blank"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-brand-deepPlum/20 text-xs font-bold text-brand-deepPlum hover:bg-white transition"
              >
                <Store className="w-4 h-4" />
                <span>Open Public Store ↗</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          DESKTOP SIDEBAR NAVIGATION (Hidden on mobile)
         ------------------------------------------------------------- */}
      <aside className="hidden md:flex w-64 bg-white border-r border-brand-deepPlum/15 flex-col justify-between p-4 shrink-0 shadow-sm sticky top-0 h-screen">
        <div>
          {/* Admin Header */}
          <div className="flex items-center justify-between pb-4 border-b border-brand-deepPlum/10">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/brand/logo.png" alt="Miss Malli" className="h-10 w-10 rounded-full object-cover ring-1 ring-brand-deepPlum/15 shadow-2xs" />
              <div>
                <span className="font-serif font-bold text-sm tracking-wide text-brand-deepPlum block leading-tight">
                  MISS MALLI
                </span>
                <span className="text-[10px] tracking-widest uppercase font-extrabold text-brand-plum block">
                  SELLER ADMIN
                </span>
              </div>
            </Link>

            <Link
              to="/"
              target="_blank"
              className="p-2 text-brand-deepPlum hover:text-brand-plum rounded-lg hover:bg-brand-ivory transition"
              title="View Public Store"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 mt-5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.to === "/admin" 
                ? currentPath === "/admin" || currentPath === "/admin/"
                : currentPath.startsWith(item.to);

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    isActive
                      ? "bg-brand-deepPlum text-white shadow-md"
                      : "text-brand-deepPlum/80 hover:bg-brand-ivory hover:text-brand-deepPlum"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-brand-plum text-white" : "bg-brand-plum text-white"
                    }`}>
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Back to store pill */}
        <div className="pt-4 border-t border-brand-deepPlum/10">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 text-xs font-bold text-brand-deepPlum/70 hover:text-brand-plum"
          >
            <Store className="w-4 h-4" />
            <span>Open Customer Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-5xl">
        <Outlet />
      </main>
    </div>
  );
}
