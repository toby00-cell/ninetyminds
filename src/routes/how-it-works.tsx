import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it Works — NinetyMinds" },
      { name: "description", content: "How NinetyMinds scouts grassroots talent and supports athlete mental wellness in Nigeria." },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  {
    n: "01",
    title: "Create your profile",
    desc: "Upload footage, add verified stats, and tell your story. Every detail helps scouts see the real you.",
  },
  {
    n: "02",
    title: "Get discovered",
    desc: "Our network of partner clubs and scouts browse verified profiles. When they see potential, they reach out directly.",
  },
  {
    n: "03",
    title: "Stay well",
    desc: "Access daily mood check-ins, 1-to-1 therapy, and peer support circles. Mental strength is peak strength.",
  },
];

const challenges = [
  { n: "01", t: "Invisible to scouts", d: "Rural talent rarely meets a professional eye. Distance and gatekeeping kill careers before they start." },
  { n: "02", t: "Minds left behind", d: "Pressure, anxiety and isolation go untreated. Performance suffers. Athletes burn out before twenty." },
  { n: "03", t: "No data, no trust", d: "Without verified stats and footage, clubs can't take a risk on a name they don't know." },
];

function HowItWorks() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Steps */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
        <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">The Process</div>
        <h1 className="font-display text-5xl lg:text-7xl leading-[0.95] max-w-3xl mb-14">
          From street pitch <em className="text-pitch">to spotlight.</em>
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.n} className="bg-card rounded-2xl p-8 border border-border hover:bg-sand transition-colors">
              <div className="font-display text-6xl text-pitch mb-6">{s.n}</div>
              <h3 className="font-display text-2xl mb-3">{s.title}</h3>
              <p className="text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Challenge */}
      <div className="bg-ink text-cream">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">The Challenge</div>
              <h2 className="font-display text-5xl lg:text-6xl leading-[0.95]">
                Talent is everywhere.<br /> <em>Opportunity</em> isn't.
              </h2>
            </div>
            <div className="lg:col-span-8 grid gap-px bg-cream/10 rounded-2xl overflow-hidden">
              {challenges.map((c) => (
                <div key={c.n} className="bg-ink p-8 flex gap-8 items-start border-b border-cream/10 last:border-b-0">
                  <div className="font-display text-5xl text-pitch shrink-0 w-16">{c.n}</div>
                  <div>
                    <h3 className="text-2xl font-display mb-2">{c.t}</h3>
                    <p className="text-cream/70 max-w-lg">{c.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 text-center">
        <h2 className="font-display text-4xl lg:text-6xl leading-[0.95] text-balance max-w-3xl mx-auto">
          Ready to get started?
        </h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Your trial begins the moment a scout opens your profile. Create yours today.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <a href="#" className="px-7 py-4 rounded-full bg-ink text-cream font-medium hover:bg-pitch transition-colors">Create athlete profile</a>
          <a href="#" className="px-7 py-4 rounded-full border border-ink/20 font-medium hover:bg-sand">I'm a scout →</a>
        </div>
      </div>
    </div>
  );
}
