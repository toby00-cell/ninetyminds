import { createFileRoute } from "@tanstack/react-router";
import wellness from "@/assets/wellness.jpg";

export const Route = createFileRoute("/wellness-hub")({
  head: () => ({
    meta: [
      { title: "Wellness Hub — NinetyMinds" },
      { name: "description", content: "Mental health support for Nigerian athletes. Anonymous check-ins, therapy sessions, and peer circles." },
    ],
  }),
  component: WellnessHub,
});

const services = [
  ["Daily mood pulse", "Two taps. Honest data, only for you."],
  ["1-to-1 sessions", "Vetted therapists who understand the game."],
  ["Team circles", "Closed spaces for clubs and academies."],
];

function WellnessHub() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 relative">
          <div className="aspect-[4/5] rounded-[2rem] overflow-hidden grain">
            <img src={wellness} alt="Young athlete in a moment of reflection" loading="lazy" width={1200} height={1400} className="h-full w-full object-cover" />
          </div>
          <div className="absolute -top-6 -right-6 bg-pitch text-cream rounded-2xl p-5 w-56 rotate-[3deg] shadow-xl">
            <div className="text-xs uppercase tracking-widest opacity-80">Wellness check-in</div>
            <div className="font-display text-3xl mt-1">3 mins, daily.</div>
          </div>
        </div>
        <div className="lg:col-span-6">
          <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">The Wellness Hub</div>
          <h1 className="font-display text-5xl lg:text-6xl leading-[0.95] mb-6">
            A career is long.<br /> A mind is <em className="text-pitch">longer</em>.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mb-8">
            Anonymous check-ins, on-call sports psychologists, peer circles in Pidgin, Yoruba, Igbo and Hausa. Built with Nigerian clinicians, for Nigerian athletes.
          </p>
          <ul className="space-y-4">
            {services.map(([t, d]) => (
              <li key={t} className="flex gap-5 border-b border-border pb-4">
                <span className="font-display text-pitch text-3xl leading-none">→</span>
                <div>
                  <div className="font-medium">{t}</div>
                  <div className="text-sm text-muted-foreground">{d}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
