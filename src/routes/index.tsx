import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import p1 from "@/assets/player-1.jpg";
import p2 from "@/assets/player-2.jpg";
import p3 from "@/assets/player-3.jpg";
import wellness from "@/assets/wellness.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NinetyMinds — Grassroots football, healthy minds." },
      { name: "description", content: "Nigeria's scouting and mental wellness platform for grassroots footballers. Get seen. Stay well." },
    ],
  }),
  component: Index,
});

const players = [
  { name: "Chidera Okonkwo", pos: "Midfielder", age: 19, city: "Lagos", img: p1, rating: 83, stats: [["187","Caps"],["42","Goals"],["67","Assists"]] },
  { name: "Amina Ibrahim", pos: "Forward", age: 21, city: "Abuja", img: p2, rating: 84, stats: [["115","Caps"],["62","Goals"],["34","Assists"]] },
  { name: "Tunde Bakare", pos: "Winger", age: 17, city: "Ibadan", img: p3, rating: 80, stats: [["64","Caps"],["28","Goals"],["19","Assists"]] },
];

const challenges = [
  { n: "01", t: "Invisible to scouts", d: "Rural talent rarely meets a professional eye. Distance and gatekeeping kill careers before they start." },
  { n: "02", t: "Minds left behind", d: "Pressure, anxiety and isolation go untreated. Performance suffers. Athletes burn out before twenty." },
  { n: "03", t: "No data, no trust", d: "Without verified stats and footage, clubs can't take a risk on a name they don't know." },
];

function Index() {
  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-12 pb-16 lg:pt-20 lg:pb-28 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl leading-[1.0] tracking-tight text-balance">
              Healthy minds.<br />
              <em className="text-pitch">Peak</em> performance.<br />
              <span className="text-ember">Naija</span> football.
            </h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground">
              We scout the boys and girls the academies miss, and we keep their heads in the game. A platform for grassroots talent and the wellness that sustains it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#scouting" className="px-5 py-3 rounded-full bg-ink text-cream text-sm font-medium hover:bg-pitch transition-colors">
                Explore talents
              </a>
              <a href="#wellness" className="px-5 py-3 rounded-full border border-ink/20 text-sm font-medium hover:bg-sand transition-colors">
                Wellness hub →
              </a>
            </div>
          </div>
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl grain">
              <img src={hero} alt="Grassroots footballers at sunset in Nigeria" className="h-full w-full object-cover" width={1600} height={1200} />
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-ink/80 to-transparent text-cream">
                <div className="font-display text-2xl">"They saw me."</div>
                <div className="text-xs uppercase tracking-widest opacity-70 mt-1">— signed from a Lagos street pitch, 2025</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-ember text-cream rounded-xl p-3 w-36 shadow-xl rotate-[-4deg]">
              <div className="font-display text-3xl leading-none">1,284</div>
              <div className="text-xs uppercase tracking-widest mt-1">talents scouted</div>
            </div>
          </div>
        </div>
        {/* Marquee */}
        <div className="border-y border-ink/10 bg-sand/60 overflow-hidden">
          <div className="flex gap-12 py-3 whitespace-nowrap animate-[marquee_40s_linear_infinite] text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="flex items-center gap-12">
                Grassroots first <span className="text-ember">●</span>
                Mental wellness <span className="text-pitch">●</span>
                Verified stats <span className="text-ember">●</span>
                Naija pride <span className="text-pitch">●</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CHALLENGE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="text-xs uppercase tracking-[0.2em] text-ember mb-3">The Challenge</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05]">
              Talent is everywhere.<br /> <em>Opportunity</em> isn't.
            </h2>
          </div>
          <div className="lg:col-span-8 grid gap-px bg-border rounded-2xl overflow-hidden">
            {challenges.map(c => (
              <div key={c.n} className="bg-card p-6 sm:p-8 flex gap-5 sm:gap-8 items-start hover:bg-sand transition-colors">
                <div className="font-display text-3xl sm:text-4xl text-pitch shrink-0 w-12">{c.n}</div>
                <div>
                  <h3 className="text-lg sm:text-xl font-display mb-1">{c.t}</h3>
                  <p className="text-sm text-muted-foreground max-w-lg">{c.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE PROVIDE */}
      <section className="bg-sand/50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.2em] text-ember mb-3">What We Provide</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05] max-w-2xl mx-auto">
              Everything a grassroots athlete needs. <em className="text-pitch">In one place.</em>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 6.32 17.36M5.68 4.64A10 10 0 0 0 12 22"/><path d="m8 12 2.5 2.5L16 9"/>
                  </svg>
                ),
                label: "Talent Scouting",
                title: "Get seen by the right clubs",
                desc: "We build verified profiles for grassroots players and connect them directly with scouts from Nigerian academies, NPFL clubs, and beyond.",
                cta: "Explore players →",
                href: "/featured-players",
                accent: "bg-pitch/10 text-pitch",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6v6l4 2"/>
                  </svg>
                ),
                label: "Wellness Hub",
                title: "Mind first, always",
                desc: "Anonymous mood check-ins, 1-to-1 sessions with Nigerian sports psychologists, and peer circles in Pidgin, Yoruba, Igbo and Hausa.",
                cta: "Visit the hub →",
                href: "/wellness-hub",
                accent: "bg-ember/10 text-ember",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                ),
                label: "Stories & Community",
                title: "Real voices from the pitch",
                desc: "Long-form reporting on grassroots football, mental wellness, and the coaches, communities, and clubs changing Nigerian sport from the ground up.",
                cta: "Read stories →",
                href: "/stories",
                accent: "bg-pitch/10 text-pitch",
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group bg-card rounded-2xl p-7 border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${item.accent}`}>
                  {item.icon}
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{item.label}</div>
                <h3 className="font-display text-xl mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{item.desc}</p>
                <div className="mt-5 text-sm font-semibold text-pitch group-hover:underline">{item.cta}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SCOUTING */}
      <section id="scouting" className="bg-ink text-cream py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-ember mb-3">Scouting</div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-6xl leading-[1.0] max-w-2xl">
                The next eleven, <em className="text-ember">already playing.</em>
              </h2>
            </div>
            <a href="#" className="text-sm uppercase tracking-widest border-b border-cream/40 pb-1 hover:text-ember hover:border-ember">View full roster →</a>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {players.map((p, i) => (
              <article key={p.name} className="group bg-cream text-ink rounded-2xl overflow-hidden flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={p.img} alt={p.name} loading="lazy" width={896} height={1152} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-3 left-3 bg-cream/90 backdrop-blur px-2.5 py-1 rounded-full text-xs uppercase tracking-widest">{p.pos}</div>
                  <div className="absolute top-3 right-3 bg-ember text-cream rounded-full h-10 w-10 grid place-items-center font-display text-lg">{p.rating}</div>
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-cream via-cream/80 to-transparent">
                    <h3 className="font-display text-2xl leading-tight">{p.name}</h3>
                    <div className="text-sm text-muted-foreground">{p.age} · {p.city} · No. {i + 7}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
                  {p.stats.map(([v, l]) => (
                    <div key={l} className="p-3 text-center">
                      <div className="font-display text-xl">{v}</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WELLNESS */}
      <section id="wellness" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16 lg:py-24 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-6 relative">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden grain">
            <img src={wellness} alt="Young athlete in a moment of reflection" loading="lazy" width={1200} height={1400} className="h-full w-full object-cover" />
          </div>
          <div className="absolute -top-4 -right-4 bg-pitch text-cream rounded-xl p-4 w-48 rotate-[3deg] shadow-xl">
            <div className="text-xs uppercase tracking-widest opacity-80">Wellness check-in</div>
            <div className="font-display text-2xl mt-1">3 mins, daily.</div>
          </div>
        </div>
        <div className="lg:col-span-6">
          <div className="text-xs uppercase tracking-[0.2em] text-ember mb-3">The Wellness Hub</div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05] mb-5">
            A career is long.<br /> A mind is <em className="text-pitch">longer</em>.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mb-6">
            Anonymous check-ins, on-call sports psychologists, peer circles in Pidgin, Yoruba, Igbo and Hausa. Built with Nigerian clinicians, for Nigerian athletes.
          </p>
          <ul className="space-y-4">
            {[
              ["Daily mood pulse", "Two taps. Honest data, only for you."],
              ["1-to-1 sessions", "Vetted therapists who understand the game."],
              ["Team circles", "Closed spaces for clubs and academies."],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-4 border-b border-border pb-4">
                <span className="font-display text-pitch text-2xl leading-none">→</span>
                <div>
                  <div className="font-semibold text-sm">{t}</div>
                  <div className="text-sm text-muted-foreground">{d}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="bg-ink text-cream py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10">
          {[["1,284","talents scouted"],["86","partner clubs"],["12,400","wellness sessions"],["36","states reached"]].map(([n, l]) => (
            <div key={l}>
              <div className="font-display text-4xl sm:text-5xl lg:text-6xl leading-none">{n}</div>
              <div className="text-xs uppercase tracking-widest mt-2 opacity-80">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16 lg:py-24 text-center">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-6xl leading-[1.05] text-balance max-w-3xl mx-auto">
          Your trial begins <em className="text-ember">the moment</em> a scout opens your profile.
        </h2>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link to="/register/athlete" className="px-6 py-3.5 rounded-full bg-ink text-cream font-medium text-sm hover:bg-pitch transition-colors">Create athlete profile</Link>
          <Link to="/register/scout" className="px-6 py-3.5 rounded-full border border-ink/20 font-medium text-sm hover:bg-sand">I'm a scout →</Link>
        </div>
      </section>

      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}