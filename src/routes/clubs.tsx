import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/clubs")({
  head: () => ({
    meta: [
      { title: "Clubs — NinetyMinds" },
      { name: "description", content: "Discover football clubs and academies across Nigeria. Connect with verified grassroots talent." },
      { property: "og:title", content: "Clubs — NinetyMinds" },
      { property: "og:description", content: "Discover football clubs and academies across Nigeria. Connect with verified grassroots talent." },
    ],
  }),
  component: ClubsPage,
});

const clubs = [
  {
    name: "Lagos Island FC Academy",
    city: "Lagos",
    state: "Lagos State",
    tier: "Tier 1 Academy",
    scouted: 14,
    openSpots: 3,
    founded: 2011,
    contact: "scout@lagosislandfc.ng",
    phone: "+234 801 234 5678",
    website: "lagosislandfc.ng",
    coach: "Emmanuel Adeyemi",
    about: "One of Lagos' most respected youth academies, Lagos Island FC has produced players currently active in the NPFL and feeder leagues. Training sessions run six days a week with structured S&C support.",
    positions: ["Goalkeeper", "Centre Back", "Defensive Midfielder"],
    ageGroups: ["U-15", "U-17", "U-20"],
    trialProcess: "Submit profile via NinetyMinds. Shortlisted players invited for a 3-day trial camp held the first week of every month.",
  },
  {
    name: "Abuja Queens FC",
    city: "Abuja",
    state: "FCT",
    tier: "Premier Women",
    scouted: 9,
    openSpots: 2,
    founded: 2015,
    contact: "recruitment@abujaqueens.ng",
    phone: "+234 802 345 6789",
    website: "abujaqueens.ng",
    coach: "Fatima Yusuf",
    about: "Abuja Queens FC competes in the NWFL Premier League and has been a consistent pathway for female players from the FCT and surrounding states to reach senior national team level.",
    positions: ["Forward", "Right Back"],
    ageGroups: ["U-17", "Senior Women"],
    trialProcess: "Open trials held quarterly. Players must have a verified NinetyMinds profile to be considered. Contact the recruitment office to confirm trial dates.",
  },
  {
    name: "Shooting Stars Youth",
    city: "Ibadan",
    state: "Oyo State",
    tier: "Youth Development",
    scouted: 21,
    openSpots: 5,
    founded: 2008,
    contact: "youth@shootingstars3sc.ng",
    phone: "+234 803 456 7890",
    website: "shootingstars3sc.ng",
    coach: "Babatunde Okafor",
    about: "The youth arm of one of Nigeria's most storied clubs, 3SC Youth has a pipeline directly to the senior squad. Players who excel in the academy system are regularly promoted to reserve and first-team training.",
    positions: ["Winger", "Striker", "Attacking Midfielder", "Left Back", "Centre Back"],
    ageGroups: ["U-13", "U-15", "U-17", "U-20"],
    trialProcess: "Walk-in trials every Saturday at the 3SC Training Ground, Adamasingba. Bring boots, kit, and a verified NinetyMinds profile QR code.",
  },
  {
    name: "Rangers Int'l Feeder",
    city: "Enugu",
    state: "Enugu State",
    tier: "Feeder Club",
    scouted: 7,
    openSpots: 1,
    founded: 2013,
    contact: "feeder@rangersintl.ng",
    phone: "+234 804 567 8901",
    website: "rangersintl.ng",
    coach: "Chukwuemeka Eze",
    about: "Officially affiliated with Rangers International FC, this feeder structure provides a direct pathway to one of the NPFL's most competitive squads. Standards are high and competition for places is fierce.",
    positions: ["Centre Back"],
    ageGroups: ["U-20", "Reserve"],
    trialProcess: "Invitation only. Scouts identify players through NinetyMinds and local competitions. Ensure your profile is complete and up to date.",
  },
  {
    name: "Abia Warriors Academy",
    city: "Aba",
    state: "Abia State",
    tier: "Tier 2 Academy",
    scouted: 12,
    openSpots: 4,
    founded: 2016,
    contact: "academy@abiawarriors.ng",
    phone: "+234 805 678 9012",
    website: "abiawarriors.ng",
    coach: "Ikenna Obi",
    about: "Based in Aba, Abia Warriors Academy draws from one of Nigeria's most football-dense regions. The club has developed several players now active in NPFL clubs and is known for its technical emphasis in early development.",
    positions: ["Goalkeeper", "Midfielder", "Winger", "Striker"],
    ageGroups: ["U-15", "U-17", "U-20"],
    trialProcess: "Monthly open trials. Register via NinetyMinds and bring your profile to the Abia Warriors Training Ground on the first Monday of each month.",
  },
  {
    name: "Kano Pillarettes",
    city: "Kano",
    state: "Kano State",
    tier: "Premier Women",
    scouted: 6,
    openSpots: 2,
    founded: 2010,
    contact: "recruitment@kanopillarettes.ng",
    phone: "+234 806 789 0123",
    website: "kanopillarettes.ng",
    coach: "Hauwa Ibrahim",
    about: "The women's affiliate of Kano Pillars, Kano Pillarettes competes in the NWFL and serves as the primary development pathway for female footballers across the north of Nigeria.",
    positions: ["Defensive Midfielder", "Centre Back"],
    ageGroups: ["U-17", "Senior Women"],
    trialProcess: "Trials by appointment. Submit your NinetyMinds profile to the recruitment email and the coaching staff will follow up within 7 working days.",
  },
  {
    name: "Rivers Angels U-17",
    city: "Port Harcourt",
    state: "Rivers State",
    tier: "Youth Development",
    scouted: 18,
    openSpots: 6,
    founded: 2007,
    contact: "u17@riversangels.ng",
    phone: "+234 807 890 1234",
    website: "riversangels.ng",
    coach: "Blessing Nwosu",
    about: "The youth structure of Rivers Angels FC, one of the most successful women's clubs in Nigerian football history. The U-17 side is a direct pipeline to the NWFL champions, with multiple players promoted each season.",
    positions: ["Goalkeeper", "Left Back", "Right Back", "Winger", "Forward", "Striker"],
    ageGroups: ["U-15", "U-17"],
    trialProcess: "Open trials quarterly at the Sharks Stadium training pitch. All players must register via NinetyMinds in advance. Walk-ins are not accepted.",
  },
  {
    name: "Plateau United Reserves",
    city: "Jos",
    state: "Plateau State",
    tier: "Reserve Squad",
    scouted: 11,
    openSpots: 3,
    founded: 2014,
    contact: "reserves@plateauunited.ng",
    phone: "+234 808 901 2345",
    website: "plateauunited.ng",
    coach: "Moses Danladi",
    about: "The reserve setup of Plateau United FC, current NPFL champions. Players in the reserve squad train daily alongside the first team and are regularly promoted when opportunities arise. The pathway to the first team is real and well-documented.",
    positions: ["Centre Back", "Defensive Midfielder", "Striker"],
    ageGroups: ["Reserve", "U-20"],
    trialProcess: "Highly selective. Scouts actively monitor NinetyMinds profiles and local competitions. No walk-in trials. Players must be identified through the scouting network.",
  },
];

function ClubsPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16 lg:py-24">
        <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Partner Clubs</div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.0] max-w-3xl mb-4">
          Clubs scouting on <span className="text-pitch">NinetyMinds.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mb-10">
          Academies, feeder clubs and senior sides across Nigeria use NinetyMinds to find verified talent — and to give that talent real mental wellness support.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {[["86","Partner clubs"],["1,284","Players scouted"],["36","States covered"],["94%","Profiles verified"]].map(([v, l]) => (
            <div key={l} className="bg-card border border-border rounded-2xl p-5">
              <div className="font-display text-4xl text-pitch">{v}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{l}</div>
            </div>
          ))}
        </div>

        {/* Club cards */}
        <div className="space-y-6">
          {clubs.map((c) => (
            <article key={c.name} className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="p-6 sm:p-8 border-b border-border">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-5">
                    <div className="shrink-0 h-14 w-14 rounded-xl bg-pitch text-cream grid place-items-center font-display text-2xl">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-ember mb-1">{c.tier}</div>
                      <h2 className="font-display text-2xl sm:text-3xl leading-tight">{c.name}</h2>
                      <div className="text-sm text-muted-foreground mt-1">{c.city}, {c.state} · Est. {c.founded}</div>
                    </div>
                  </div>
                  <div className="hidden sm:grid grid-cols-2 gap-6 text-right shrink-0">
                    <div>
                      <div className="font-display text-2xl">{c.scouted}</div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">Signed</div>
                    </div>
                    <div>
                      <div className="font-display text-2xl text-ember">{c.openSpots}</div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">Open trials</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 grid md:grid-cols-3 gap-8">
                {/* About */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-ember mb-2">About</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.about}</p>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-ember mb-2">Trial Process</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.trialProcess}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {c.ageGroups.map((ag) => (
                      <span key={ag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-sand border border-border">
                        {ag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Positions needed */}
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-ember mb-2">Positions Needed</div>
                    <div className="flex flex-wrap gap-1.5">
                      {c.positions.map((p) => (
                        <span key={p} className="text-xs font-medium px-2.5 py-1 rounded-full bg-pitch/10 text-pitch">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-ember mb-2">Contact</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        {c.coach}
                      </div>
                      <a href={`mailto:${c.contact}`} className="flex items-center gap-2 text-pitch hover:underline">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        {c.contact}
                      </a>
                      <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-pitch hover:underline">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.64 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.62v-.7z"/></svg>
                        {c.phone}
                      </a>
                      <a href={`https://${c.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-pitch hover:underline">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                        {c.website}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-ink text-cream rounded-3xl p-8 lg:p-14 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl leading-tight">
              Are you a club? <em className="text-ember">Scout with us.</em>
            </h2>
            <p className="mt-3 text-cream/70 max-w-md">
              Get verified profiles, video, and stats from grassroots talent across all 36 states. Free for accredited Nigerian clubs in 2026.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link to="/how-it-works" className="px-6 py-3 rounded-full bg-ember text-cream font-medium hover:opacity-90 transition">How it works</Link>
            <Link to="/featured-players" className="px-6 py-3 rounded-full border border-cream/30 text-cream hover:bg-cream/10 transition">Browse players</Link>
          </div>
        </div>
      </div>
    </div>
  );
}