import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/wellness-hub/$articleSlug")({
  loader: ({ params }) => {
    const article = articles.find((a) => a.slug === params.articleSlug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.article.title} — NinetyMinds Wellness` },
          { name: "description", content: loaderData.article.excerpt },
        ]
      : [{ title: "Wellness — NinetyMinds" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-32 text-center">
      <h1 className="font-display text-4xl mb-4">Article not found</h1>
      <Link to="/wellness-hub" className="text-pitch hover:underline">← Back to Wellness Hub</Link>
    </div>
  ),
  component: ArticlePage,
});

export const articles = [
  {
    slug: "pre-match-nerves",
    tag: "Anxiety",
    title: "Pre-match nerves: what your body is actually doing",
    excerpt: "The physical symptoms of anxiety before a big game are real — and manageable. Here's what's happening in your nervous system and how to work with it, not against it.",
    read: "5 min",
    author: "Dr. Femi Oladipo",
    authorRole: "Sports Psychologist",
    content: [
      "You know the feeling. It's the morning of the match. Your stomach is turning. Your legs feel wrong. Your mouth is dry and your heart is doing something it doesn't normally do. You wonder if something is wrong with you — or if this means you aren't ready.",
      "Nothing is wrong with you. Your body is doing exactly what it was designed to do.",
      "What you're experiencing is called the stress response — a cascade of physiological changes triggered by your brain interpreting the upcoming match as something that matters. Your adrenal glands release adrenaline and cortisol. Your heart rate increases to pump more blood to your muscles. Your digestive system slows down (which is why your stomach feels wrong). Your senses sharpen.",
      "This is your body preparing to perform.",
      "The problem isn't the nervousness itself — it's what we tell ourselves about it. Most athletes interpret these sensations as a warning sign: I'm not ready. I'm going to play badly. Something is wrong. But research consistently shows that athletes who reframe anxiety as excitement — 'I'm pumped up, not scared' — perform significantly better than those who try to calm down.",
      "The sensations are identical. The story you tell about them changes everything.",
      "Here are three things that actually work in the 30 minutes before a match:",
      "First: name it. Say out loud or in your head — 'I'm nervous and that's okay. My body is ready.' This is called affect labelling and it reduces the intensity of the emotion almost immediately.",
      "Second: breathe on a count. Breathe in for 4 counts, hold for 4, out for 6. The extended exhale activates your parasympathetic nervous system — the brake pedal on your stress response. You don't need to stop the adrenaline entirely. Just turn the volume down slightly.",
      "Third: find your anchor. Every great athlete has a physical ritual that signals readiness — a specific way of putting on their boots, a phrase they say, a movement they repeat. This isn't superstition. It's a trained association between a behaviour and a mental state. Build yours deliberately.",
      "Pre-match nerves are not a problem to solve. They are a resource to use. The goal isn't to arrive at the pitch feeling calm. The goal is to arrive feeling ready — and knowing the difference.",
    ],
    quote: "I used to think nerves meant I wasn't confident. Now I know they mean I care. And caring is the whole point.",
    quoteAttr: "Nigerian U-20 midfielder, Lagos",
  },
  {
    slug: "tired-vs-burnout",
    tag: "Burnout",
    title: "How to tell the difference between tired and burned out",
    excerpt: "Every athlete gets tired. Burnout is something different — and if you don't catch it early, it can end a season before it starts.",
    read: "4 min",
    author: "Ngozi Adimora",
    authorRole: "Grassroots Editor",
    content: [
      "There is a kind of tired that sleep fixes. You play hard, you rest, you wake up ready again. This is normal. This is what training is supposed to feel like.",
      "Then there is a kind of tired that sleep doesn't fix. You wake up after eight hours and you still don't want to go. The pitch that used to feel like home starts to feel like an obligation. You go through the motions. You score and feel nothing. You miss and feel nothing. Everything feels flat.",
      "That is burnout — and it is far more common among Nigerian grassroots players than anyone talks about.",
      "Burnout in sport has three recognisable signs. The first is exhaustion that doesn't recover with rest. The second is depersonalisation — a sense of distance from the game, from teammates, from the thing you used to love. The third is reduced sense of accomplishment — working just as hard but feeling like nothing you do matters.",
      "The causes are often structural. In the Nigerian grassroots context, players frequently train twice a day in intense heat with poor nutrition and no recovery support. They carry financial pressure from families expecting a professional contract. They receive minimal positive feedback and enormous negative feedback. Some play through physical injuries because they fear losing their place.",
      "The body keeps a ledger. When withdrawals consistently outpace deposits, burnout is the result.",
      "If you recognise yourself in this, here is what matters most: burnout is not weakness. It is a rational response to an unsustainable load. And unlike injury, it is reversible — but only if you catch it early and respond honestly.",
      "The first step is always the same: tell someone. A coach, a teammate, a family member, a counsellor. Not because they will fix it immediately, but because keeping it secret makes it worse. Isolation is burnout's best friend.",
      "The second step is to identify what you have lost and what you still have. Often, burned-out athletes haven't lost their love of the game — they've lost their sense of agency within it. Small choices, even tiny ones — which drills to focus on, which position to practice — can begin to restore that.",
      "Rest is not giving up. It is strategy.",
    ],
    quote: "I trained through it for three months because I thought stopping meant I was weak. The day I told my coach, everything started changing.",
    quoteAttr: "Forward, Abuja Queens FC",
  },
  {
    slug: "identity-after-rejection",
    tag: "Identity",
    title: "What happens to your sense of self after a missed trial",
    excerpt: "Being rejected by a club doesn't mean you aren't good enough. But the emotional aftermath can feel that way. A guide to rebuilding confidence after a setback.",
    read: "6 min",
    author: "Dr. Femi Oladipo",
    authorRole: "Sports Psychologist",
    content: [
      "You had the trial. You trained for months. You believed — genuinely believed — that this was the moment. And then the call didn't come. Or worse, it came with the wrong answer.",
      "What happens next is predictable, and knowing that it is predictable doesn't make it less painful — but it does make it easier to navigate.",
      "For many grassroots footballers, especially in Nigeria where the stakes are both personal and familial, a failed trial doesn't feel like a professional setback. It feels like an identity collapse. This is because sport, when it is deeply pursued, becomes fused with the self. 'I am a footballer' is not just a description of activity — it is a description of who you are. A rejection letter doesn't just say 'we don't need you right now.' It seems to say: 'you are not who you thought you were.'",
      "This is a cognitive distortion — a mismatch between what actually happened and what the brain concludes from it. But understanding that intellectually rarely makes it feel less true in the days after.",
      "The grief process after a significant sporting rejection is real and follows recognisable patterns: disbelief, anger, bargaining ('if I'd done that differently'), depression, and eventually, acceptance. Allow yourself to move through these rather than skipping to the final stage by force.",
      "What separates athletes who recover and go on to succeed from those who don't is rarely talent. It is the quality of the narrative they build about the experience. A rejection can be a verdict — 'I am not good enough' — or it can be data: 'I am not at the level this club needed right now, and here is what that tells me about where to focus.'",
      "The second narrative is not delusion. It is accuracy. Most failed trials happen for reasons only partly related to the athlete's ability: the club already had someone in that position, the scout had a different profile in mind, the player was having an off day, the timing was wrong.",
      "Here is what you should actually do in the weeks after a rejection: First, take three to five days away from intense training — not forever, just enough to let the acute emotion pass. Second, write down three things you did well in the trial. Force yourself to find them. Third, talk to your coach or someone who watched you play about specific, technical things to work on. Convert the rejection into a development roadmap.",
      "Your identity is not the trial result. Your identity is the sum of everything you do next.",
    ],
    quote: "The trial said no. I kept asking what question I needed to answer differently — and eventually I got to yes.",
    quoteAttr: "Winger, now signed to a Lagos Premier League feeder club",
  },
  {
    slug: "injury-and-mental-health",
    tag: "Recovery",
    title: "Injury recovery and mental health: the part no one talks about",
    excerpt: "Physical rehab gets all the attention. But the isolation, the fear of re-injury, and the loss of identity that come with being sidelined are just as real.",
    read: "7 min",
    author: "Kunle Adeyemi",
    authorRole: "Features Writer",
    content: [
      "When a Nigerian grassroots player gets injured, the support system — such as it is — focuses almost entirely on the physical. Ice. Rest. Physiotherapy if the family can afford it. The mental dimension of injury recovery is treated as either irrelevant or self-indulgent.",
      "This is a mistake with real consequences.",
      "Research on elite athletes across multiple sports shows that psychological distress following injury is nearly universal — and that untreated psychological distress significantly lengthens physical recovery time. The mind and body are not separate systems. Stress hormones impair tissue repair. Anxiety reduces sleep quality, which is when most physical healing occurs. Fear of re-injury causes compensatory movement patterns that lead to new injuries.",
      "At the grassroots level in Nigeria, the psychological burden is compounded by factors that don't exist at professional clubs. There is no club welfare officer. There is no guaranteed income during recovery. There is often immense family pressure to return to play before the body is ready. And there is the slow, quiet terror of watching your position being filled by someone else.",
      "The most common psychological responses to serious injury are: grief (for the season, the opportunity, the version of yourself that was healthy); identity disruption (who am I if I can't play?); anxiety about re-injury; and depression, which often goes unrecognised because it presents as 'just being quiet' or 'taking it hard.'",
      "If you are currently injured, here are the most important things to know:",
      "Your emotional response is not weakness. Grieving a serious injury is appropriate and healthy. Fighting the grief by forcing positivity too early tends to suppress it rather than resolve it.",
      "Stay connected to your team. Physically attending training when you cannot participate, watching games, being present in team spaces — this matters enormously for mental health during recovery. Isolation accelerates depression.",
      "Set small, daily recovery goals. Not 'be back by the end of the month' — that is too large and too unpredictable. 'Walk for 20 minutes today.' 'Do my rehab exercises before noon.' Small completed goals rebuild the sense of agency that injury destroys.",
      "Talk to someone about the fear. Re-injury anxiety is the most persistent psychological challenge in recovery. Left unaddressed, it can cause players to hold back physically even after they are medically cleared — which both reduces performance and, paradoxically, increases injury risk. A sports psychologist or even a trusted coach can help you work through this with evidence-based techniques.",
      "Your body will come back. Make sure your mind does too.",
    ],
    quote: "The knee healed in three months. It took me another two months to trust it again. Nobody told me that would happen.",
    quoteAttr: "Defender, Rivers State",
  },
  {
    slug: "sleep-and-performance",
    tag: "Sleep",
    title: "Why Nigerian athletes sleep less — and what it costs them",
    excerpt: "Late training schedules, travel, family pressure and noisy environments all chip away at sleep. Here's the science on what that does to your game.",
    read: "4 min",
    author: "Dr. Femi Oladipo",
    authorRole: "Sports Psychologist",
    content: [
      "Sleep is the single most powerful performance enhancer available to any athlete — and it is free. It is also the one that grassroots Nigerian footballers are most consistently deprived of.",
      "The reasons are structural. Evening training sessions that run until 9pm or later. Cramped living situations with multiple family members in shared rooms. Noise, heat, and inadequate bedding. Long commutes to and from training grounds. Financial anxiety that keeps the mind active long after the body has stopped moving. For many players, getting seven to nine hours of quality sleep feels like a luxury that the circumstances don't allow.",
      "But here is what those circumstances are actually costing, game by game:",
      "Reaction time degrades significantly with even mild sleep deprivation — the kind you get from consistently sleeping six hours instead of eight. Decision-making under pressure becomes slower and less accurate. Sprint speed and jump height decrease measurably. The risk of soft tissue injury increases by a striking degree among athletes sleeping less than six hours.",
      "Perhaps most relevant for the mental side of the game: emotional regulation collapses without adequate sleep. The ability to manage frustration, stay composed when behind, maintain focus late in a game — all of these are directly regulated by prefrontal cortex function, which is the part of the brain most sensitive to sleep loss.",
      "You cannot out-train poor sleep. This is not motivational language — it is physiology.",
      "For players dealing with structural barriers to sleep, here are approaches that work even in difficult conditions:",
      "Protect the 90 minutes before sleep. No screens. No intense conversations about money or family pressure. No food after a certain point. This window before sleep is when your brain begins to prepare for rest, and disrupting it delays sleep onset significantly.",
      "Make the sleep environment as dark and as cool as possible. Even partial darkness and a slightly cooler temperature improve sleep quality measurably.",
      "If you cannot sleep longer, protect sleep quality. This means avoiding caffeine after midday, limiting alcohol entirely (it fragments sleep architecture even when it helps you fall asleep), and getting consistent wake times — even on rest days. Consistency of timing matters as much as duration.",
      "Take the 20-minute nap. Not 30 minutes, which pushes you into deep sleep and causes grogginess. Twenty minutes, ideally between 1pm and 3pm, can restore alertness and motor performance for the evening session.",
      "Sleep is not passive. It is where your adaptation happens. Guard it.",
    ],
    quote: "I thought the players who woke up earliest were the most committed. Then I learned what sleep actually does and I stopped setting alarms for 5am.",
    quoteAttr: "Academy coach, Ibadan",
  },
  {
    slug: "playing-for-your-family",
    tag: "Pressure",
    title: "Playing for your family: the weight behind every goal",
    excerpt: "Many grassroots players carry the financial hopes of their household on their boots. That pressure is real, valid — and something you can learn to carry differently.",
    read: "5 min",
    author: "Ngozi Adimora",
    authorRole: "Grassroots Editor",
    content: [
      "In a lot of households across Nigeria, there is an unspoken agreement. The family has invested — in boots, in transport, in time, in belief. The player has received. And one day, the player will return it. A professional contract. A signing fee. Monthly remittances. Security.",
      "This arrangement is rarely spoken aloud. It doesn't need to be. Every player who grew up in it knows exactly what is expected — and carries it onto the pitch in every session, every trial, every match.",
      "This pressure is real. It is not imagined and it is not weakness. It is a genuine weight, and it deserves to be treated seriously rather than dismissed with advice about 'playing with freedom' that ignores the material reality of the person receiving it.",
      "But it is also weight that can be carried differently — in ways that don't compromise performance, and don't fracture the relationship between you and the game.",
      "The first thing to understand is what the pressure actually does to performance. When the stakes attached to any single game or trial become too large — when a missed penalty feels like failing your mother, when a poor training session feels like betraying your father's sacrifice — the nervous system responds to the threat by narrowing focus and tightening movement. The body that plays best is loose and reactive. The body that is carrying existential weight is braced and hesitant.",
      "Paradoxically, the more you need to perform for your family, the harder you make it to perform at your best.",
      "This doesn't mean the pressure should disappear. It means it needs to be separated from the 90 minutes.",
      "One technique that consistently helps: externalise the responsibility before the match. Write down — literally, on paper — everything you are carrying. The family expectation. The financial need. The fear of failure. Then fold the paper and put it somewhere physical — a pocket, a bag. Tell yourself: this is real, it matters, and it will be here when the match is over. But for these 90 minutes, I am not carrying it. I am just playing football.",
      "This is not a denial of your responsibilities. It is a management of the attention your responsibilities are permitted to consume in the moments when consuming them does no one any good.",
      "Talk to your family about the pressure — directly, honestly, and with love. Most Nigerian parents and siblings who are placing hope on a player don't fully understand what that hope does to the player's mind. When they do understand, most of them adjust. The expectation doesn't disappear, but the way it is communicated changes.",
      "You are not just playing for them. You are also playing because you love this. Remember that the two things are both true.",
    ],
    quote: "My father wanted me to make it so badly that every time I came home after a bad game, I felt like I had failed him. It took us a year of difficult conversations to separate the two things.",
    quoteAttr: "Midfielder, currently on trial with an NPFL club",
  },
];

const tagColors: Record<string, string> = {
  Anxiety: "bg-blue-50 text-blue-700",
  Burnout: "bg-orange-50 text-orange-700",
  Identity: "bg-purple-50 text-purple-700",
  Recovery: "bg-green-50 text-green-700",
  Sleep: "bg-indigo-50 text-indigo-700",
  Pressure: "bg-red-50 text-red-700",
};

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-ink text-cream py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10">
          <Link
            to="/wellness-hub"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-cream/60 hover:text-cream mb-8"
          >
            <ArrowLeft className="h-3 w-3" /> Wellness Hub
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${tagColors[article.tag] ?? "bg-sand text-ink"}`}>
              {article.tag}
            </span>
            <span className="text-cream/50 text-xs">{article.read} read</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05] max-w-3xl">
            {article.title}
          </h1>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center text-cream/60 text-xs font-bold">
              {article.author.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <div className="text-sm font-medium">{article.author}</div>
              <div className="text-xs text-cream/50">{article.authorRole}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10 py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <article className="lg:col-span-8">
            <div className="space-y-6">
              {article.content.map((paragraph, idx) => (
                <p
                  key={idx}
                  className={`leading-relaxed ${
                    idx === 0
                      ? "font-display text-xl sm:text-2xl text-ink leading-snug"
                      : "text-base sm:text-lg text-foreground/80"
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Pull quote */}
            <blockquote className="mt-12 border-l-4 border-pitch pl-6 py-2">
              <p className="font-display text-xl sm:text-2xl leading-snug text-ink italic">
                "{article.quote}"
              </p>
              <cite className="mt-3 block text-sm text-muted-foreground not-italic">
                — {article.quoteAttr}
              </cite>
            </blockquote>

            <div className="mt-12">
              <Link
                to="/wellness-hub"
                className="inline-flex items-center gap-2 text-sm font-medium hover:text-pitch transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Wellness Hub
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-8">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-ember mb-5">More articles</div>
                <div className="space-y-5">
                  {related.map((a) => (
                    <Link
                      key={a.slug}
                      to="/wellness-hub/$articleSlug"
                      params={{ articleSlug: a.slug }}
                      className="group block"
                    >
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tagColors[a.tag] ?? "bg-sand text-ink"}`}>
                        {a.tag}
                      </span>
                      <h3 className="font-display text-lg leading-tight mt-2 group-hover:text-pitch transition-colors">
                        {a.title}
                      </h3>
                      <div className="text-xs text-muted-foreground mt-1">{a.read} read · {a.author}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-ink text-cream rounded-2xl p-6">
                <h4 className="font-display text-xl leading-tight mb-2">Need to talk to someone?</h4>
                <p className="text-sm text-cream/70 mb-4">
                  Every NinetyMinds athlete has access to confidential support from Nigerian sports psychologists.
                </p>
                <Link
                  to="/register/athlete"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-ember text-cream text-sm font-medium hover:opacity-90 transition"
                >
                  Create your profile →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}