import { useState } from "react";
import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Form, useActionData, useNavigation, Link } from "@remix-run/react";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Store } from "lucide-react";
import { createAdminSession, isAdminAuthenticated } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  if (await isAdminAuthenticated(request)) {
    return redirect("/admin");
  }
  return json({});
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username")?.toString().trim() || "admin";
  const password = formData.get("password")?.toString();

  const env = (context as any)?.cloudflare?.env;
  // Configured admin password via environment secret, with standard secure default
  const validPassword = env?.ADMIN_PASSWORD || "missmalli2026";

  if (!password) {
    return json({ error: "Please enter your password" }, { status: 400 });
  }

  // Allow any username as long as administrator password is correct
  if (password !== validPassword) {
    return json({ 
      error: "Incorrect password. Please verify your administrator credentials." 
    }, { status: 401 });
  }

  return createAdminSession(username, "/admin");
}

export default function AdminLoginPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [username, setUsername] = useState("admin@missmalli.in");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-brand-lilac/40">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block group mb-4">
          <img
            src="/brand/logo.png"
            alt="Miss Malli"
            className="h-14 mx-auto object-contain hover:opacity-95 transition"
          />
        </Link>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-brand-plum/10 text-brand-plum tracking-wide uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          Administrator Console
        </span>
        <h2 className="mt-4 text-3xl font-serif font-bold tracking-tight text-brand-deepPlum">
          Sign In
        </h2>
        <p className="mt-2 text-sm text-brand-deepPlum/70">
          Manage products, stock inventory, and live WhatsApp customer requests
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-brand-plum/5 rounded-card border border-brand-lilac/30">
          <Form method="post" className="space-y-6">
            {actionData?.error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2 animate-shake">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {actionData.error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-brand-deepPlum uppercase tracking-wider mb-1.5">
                Admin Email / Username
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-deepPlum/40">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3.5 py-3 rounded-xl border border-brand-lilac/40 bg-brand-ivory/30 text-brand-deepPlum placeholder-brand-deepPlum/30 focus:outline-none focus:ring-2 focus:ring-brand-plum focus:border-transparent text-sm transition"
                  placeholder="admin@missmalli.in"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-brand-deepPlum uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-deepPlum/40">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-10 py-3 rounded-xl border border-brand-lilac/40 bg-brand-ivory/30 text-brand-deepPlum placeholder-brand-deepPlum/30 focus:outline-none focus:ring-2 focus:ring-brand-plum focus:border-transparent text-sm transition"
                  placeholder="Enter administrator password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-deepPlum/40 hover:text-brand-plum transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-pill border border-transparent text-sm font-semibold text-white bg-brand-plum hover:bg-brand-deepPlum focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-plum shadow-md shadow-brand-plum/20 disabled:opacity-50 active:scale-[0.99] transition"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In to Console
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </Form>

          <div className="mt-6 pt-6 border-t border-brand-lilac/20 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-plum hover:text-brand-deepPlum transition"
            >
              <Store className="w-3.5 h-3.5" />
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
