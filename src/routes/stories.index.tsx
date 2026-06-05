import { createFileRoute, Link } from "@tanstack/react-router";
import { getStories } from "@/lib/api/stories.functions";

export const Route = createFileRoute("/stories/")({
  loader: () => getStories(),
  head: () => ({
    meta: [
      { title: "Stories — NinetyMinds" },
      { name: "description", content: "Real stories from grassroots footballers and the communities shaping Nigerian football." },
      { property: "og:title", content: "Stories — NinetyMinds" },
      { property: "og:description", content: "Real stories from grassroots footballers and the communities shaping Nigerian football." },
    ],
  }),
  component: StoriesPage,
});

function StoriesPage() {
  const stories = Route.useLoaderData();
  const [feature, ...rest] = stories;

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-24">
        <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Stories</div>
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] max-w-3xl">
          Voices from <span className="text-pitch">the pitch.</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl">
          Long-form reporting on grassroots football, mental wellness, and the people changing Nigerian sport from the bottom up.
        </p>

        {/* Feature */}
        <Link
          to="/stories/$storyId"
          params={{ storyId: feature.slug }}
          className="mt-14 grid lg:grid-cols-12 gap-8 group"
        >
          <div className="lg:col-span-7 aspect-[16/10] overflow-hidden rounded-2xl">
            <img
              src={feature.img_url ?? "/assets/hero.jpg"}
              alt={feature.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="text-xs uppercase tracking-[0.2em] text-ember mb-3">
              {feature.tag} · {feature.read_time}
            </div>
            <h2 className="font-display text-4xl lg:text-5xl leading-tight mb-4 group-hover:text-pitch transition-colors">
              {feature.title}
            </h2>
            <p className="text-muted-foreground">{feature.excerpt}</p>
            <span className="mt-6 text-sm font-medium">Read story →</span>
          </div>
        </Link>

        {/* Grid */}
        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((s) => (
            <Link
              key={s.slug}
              to="/stories/$storyId"
              params={{ storyId: s.slug }}
              className="group block"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-xl mb-4">
                <img
                  src={s.img_url ?? "/assets/player-1.jpg"}
                  alt={s.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-ember mb-2">
                {s.tag} · {s.read_time}
              </div>
              <h3 className="font-display text-2xl leading-tight mb-2 group-hover:text-pitch transition-colors">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground">{s.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}