import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link, Outlet, useLocation } from "@remix-run/react";
import { 
  Inbox, 
  Package, 
  FolderTree, 
  LayoutTemplate,
  Settings as SettingsIcon, 
  ExternalLink,
  Store
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

  const navItems = [
    { label: "Requests", to: "/admin", icon: Inbox, badge: needsReplyCount },
    { label: "Homepage Editor", to: "/admin/homepage", icon: LayoutTemplate },
    { label: "Products & Stock", to: "/admin/products", icon: Package },
    { label: "Collections", to: "/admin/collections", icon: FolderTree },
    { label: "Settings", to: "/admin/settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-brand-deepPlum flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-brand-deepPlum/15 flex md:flex-col justify-between p-4 shrink-0 shadow-sm">
        <div>
          {/* Admin Header */}
          <div className="flex items-center justify-between pb-4 border-b border-brand-deepPlum/10">
            <div>
              <Link to="/" className="flex items-center gap-2">
                <img src="/brand/logo.png" alt="Miss Malli" className="h-9 w-auto object-contain" />
              </Link>
              <span className="text-[10px] tracking-widest uppercase font-extrabold text-brand-plum bg-brand-plum/10 px-2 py-0.5 rounded-full inline-block mt-2">
                Seller Admin
              </span>
            </div>

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
          <nav className="flex md:flex-col gap-1.5 mt-5 overflow-x-auto no-scrollbar">
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
        <div className="hidden md:block pt-4 border-t border-brand-deepPlum/10">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-bold text-brand-deepPlum/70 hover:text-brand-plum"
          >
            <Store className="w-4 h-4" />
            <span>Open Customer Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-5xl overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
