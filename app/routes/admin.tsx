import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link, Outlet, useLocation } from "@remix-run/react";
import { 
  Inbox, 
  Package, 
  FolderTree, 
  Percent, 
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
    { label: "Products", to: "/admin/products", icon: Package },
    { label: "Collections", to: "/admin/collections", icon: FolderTree },
    { label: "Settings", to: "/admin/settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F4] text-brand-dark flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-brand-lavender/30 flex md:flex-col justify-between p-4 shrink-0">
        <div>
          {/* Admin Header */}
          <div className="flex items-center justify-between pb-4 border-b border-brand-lavender/20">
            <div>
              <Link to="/" className="font-serif text-lg font-bold text-brand-plum flex items-center gap-1.5">
                <span>Miss Malli</span>
              </Link>
              <span className="text-[10px] tracking-widest uppercase font-bold text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-full inline-block mt-1">
                Admin Panel
              </span>
            </div>

            <Link
              to="/"
              target="_blank"
              className="p-1.5 text-brand-dark/50 hover:text-brand-purple rounded-lg hover:bg-brand-ivory transition"
              title="View Public Store"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex md:flex-col gap-1 mt-4 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.to === "/admin" 
                ? currentPath === "/admin" || currentPath === "/admin/"
                : currentPath.startsWith(item.to);

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                    isActive
                      ? "bg-brand-purple text-white shadow-sm"
                      : "text-brand-dark/70 hover:bg-brand-ivory hover:text-brand-dark"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-white text-brand-purple" : "bg-brand-rose text-white"
                    }`}>
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Back to store pill on mobile/desktop */}
        <div className="hidden md:block pt-4 border-t border-brand-lavender/20">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-medium text-brand-dark/60 hover:text-brand-purple"
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
