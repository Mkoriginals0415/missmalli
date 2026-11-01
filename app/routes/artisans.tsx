import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { ArrowRight, Sparkles, Award, Heart, CheckCircle2, ShieldCheck, Play } from "lucide-react";
import { Footer } from "~/components/layout/Footer";
import { getStoreSettings } from "~/db/d1.server";
import { DEFAULT_STORE_POLICIES, StorePolicies } from "~/db/mock-data";

export async function loader({ context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const settings = await getStoreSettings(env);
  let policies: StorePolicies = DEFAULT_STORE_POLICIES;
  try {
    if (settings.store_policies) {
      policies = { ...DEFAULT_STORE_POLICIES, ...JSON.parse(settings.store_policies) };
    }
  } catch (e) {}
  return json({ policies });
}

export default function ArtisansPage() {
  const { policies } = useLoaderData<typeof loader>();

  const stats = [
    { value: "200+", label: "Weaver families", desc: "Supported directly with fair sustainable wages" },
    { value: "12", label: "Weaving clusters", desc: "Across Kanchipuram, Varanasi & Pochampally" },
    { value: "50k+", label: "Happy customers", desc: "Draped in authentic handwoven grace worldwide" },
    { value: "100%", label: "Authentic silk", desc: "Silk Mark certified pure natural fibres" },
  ];

  const weavers = [
    {
      name: "Lakshmi Ammal",
      location: "Kanchipuram, Tamil Nadu",
      specialty: "Korvai Temple Borders & Pure Mulberry Silk",
      experience: "34 Years on the Loom",
      quote: "Every border I weave tells an ancient temple story. When a woman wears this, she wears centuries of prayer and craft.",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      featuredCraft: "Pure Kanjivaram Silk",
    },
    {
      name: "Ramesh Kumar Ansari",
      location: "Varanasi, Uttar Pradesh",
      specialty: "Kadhwa Antique Gold Zari & Katan Silk",
      experience: "28 Years on the Loom",
      quote: "A single Banarasi saree can take us up to 24 days to hand-weave. There is no machine in the world that can mimic the touch of the weaver's shuttle.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      featuredCraft: "Handwoven Banarasi",
    },
    {
      name: "Sulochana Devi",
      location: "Pochampally, Telangana",
      specialty: "Double Ikat Geometric Precision & Organic Dyes",
      experience: "22 Years on the Loom",
      quote: "The alignment of the warp and weft threads must be accurate to the millimeter before dyeing. It is mathematics woven into poetry.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
      featuredCraft: "Pochampally Ikat",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans selection:bg-brand-lilac/40">
      <main className="flex-1">
        {/* Editorial Story Hero (2-Column: Big Logo Left, Matter Right) */}
        <section className="relative py-12 sm:py-20 px-4 sm:px-8 border-b border-brand-lilac/30 overflow-hidden bg-gradient-to-b from-brand-ivory via-brand-ivory to-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Left Column: Big Brand Emblem */}
            <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
              <div className="relative group p-4 sm:p-6 rounded-full bg-gradient-to-tr from-brand-plum/10 via-brand-lilac/20 to-brand-gold/15 border border-brand-lilac/30 shadow-xl">
                <img
                  src="/brand/logo.png"
                  alt="Miss Malli - Heritage Handloom"
                  className="w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 rounded-full object-cover ring-4 ring-brand-plum/20 ring-offset-4 ring-offset-brand-ivory shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-plum/5 border border-brand-plum/10 text-[11px] font-semibold text-brand-deepPlum/80">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-plum" />
                <span>Certified Handloom & Silk Mark Authentic</span>
              </div>
            </div>

            {/* Right Column: Story Copy & Matter */}
            <div className="md:col-span-7 space-y-4 text-left">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-brand-plum/10 text-brand-plum">
                <Sparkles className="w-3.5 h-3.5" />
                {policies.ourStorySubtitle || "Our Story · 100% Handloom Heritage"}
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-brand-deepPlum tracking-tight leading-tight">
                {policies.ourStoryHeadline || "Threads of Tradition, Woven for You"}
              </h1>
              <p className="text-base sm:text-lg text-brand-deepPlum/85 leading-relaxed font-sans pt-1">
                {policies.ourStoryBody}
              </p>
              {policies.ourStoryMission && (
                <div className="p-4 sm:p-5 rounded-2xl bg-white/90 border border-brand-lilac/30 shadow-xs">
                  <p className="text-xs sm:text-sm text-brand-deepPlum/75 italic leading-relaxed">
                    "{policies.ourStoryMission}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Key Stat Badges */}
          <div className="max-w-5xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white/80 backdrop-blur-xs p-6 rounded-card border border-brand-lilac/30 text-center shadow-xs hover:border-brand-plum/30 transition"
              >
                <div className="text-3xl sm:text-4xl font-serif font-bold text-brand-plum">{s.value}</div>
                <div className="text-xs sm:text-sm font-bold text-brand-deepPlum mt-1">{s.label}</div>
                <div className="text-[11px] text-brand-deepPlum/60 mt-1 leading-snug">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Meet the Weavers Section (Page 11) */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-deepPlum">
              Meet the Master Weavers
            </h2>
            <p className="text-sm text-brand-deepPlum/70">
              Profiles of master artisans, their historic villages, and the lifelong devotion behind every single weave.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {weavers.map((w) => (
              <div
                key={w.name}
                className="bg-white rounded-card border border-brand-lilac/30 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="relative aspect-4/3 overflow-hidden bg-brand-deepPlum/5">
                    <img
                      src={w.image}
                      alt={w.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-brand-deepPlum/85 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {w.featuredCraft}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div>
                      <h3 className="font-serif font-bold text-xl text-brand-deepPlum">{w.name}</h3>
                      <div className="text-xs font-semibold text-brand-gold mt-0.5">{w.location}</div>
                      <div className="text-[11px] text-brand-deepPlum/50">{w.experience}</div>
                    </div>

                    <p className="text-xs text-brand-deepPlum/80 italic bg-brand-ivory/60 p-3.5 rounded-xl border border-brand-lilac/20 leading-relaxed">
                      “{w.quote}”
                    </p>

                    <div className="text-xs font-medium text-brand-deepPlum/70">
                      <span className="font-semibold text-brand-plum">Signature:</span> {w.specialty}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to="/sarees"
                    className="w-full py-2.5 rounded-pill bg-brand-ivory hover:bg-[#a085cc] hover:text-[#2A1235] border border-brand-lilac/40 text-brand-deepPlum text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    View Handcrafted Drapes
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Silk Mark & Authenticity Commitment */}
        <section className="bg-[#FAF5F0] border-y border-brand-lilac/30 text-[#2A1235] py-14 px-4 sm:px-8">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="space-y-3 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                <ShieldCheck className="w-4 h-4" />
                Pure Silk Mark Guarantee
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-deepPlum">
                Zero synthetic compromise. Ever.
              </h2>
              <p className="text-xs sm:text-sm text-[#2A1235]/70 max-w-xl leading-relaxed">
                Every pure silk drape in our collection carries genuine certification tags from master weaving societies, 
                tested for warp & weft purity, pure natural zari, and heirloom durability.
              </p>
            </div>
            <Link
              to="/sarees"
              className="shrink-0 px-8 py-4 rounded-pill bg-brand-primary text-brand-dark font-black text-xs uppercase tracking-wider hover:bg-[#a085cc] transition shadow-md"
            >
              Explore Heritage Collection ↗
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
