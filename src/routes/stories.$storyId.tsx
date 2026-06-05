import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getStoryBySlug, getStories } from "@/lib/api/stories.functions";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

export const Route = createFileRoute("/stories/$storyId")({
  loader: async ({ params }) => {
    const [story, allStories] = await Promise.all([
      getStoryBySlug({ data: { slug: params.storyId } }),
      getStories(),
    ]);
    if (!story) throw notFound();
    return { story, allStories };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.story.title} — NinetyMinds` },
          { name: "description", content: loaderData.story.excerpt },
          { property: "og:title", content: loaderData.story.title },
          { property: "og:description", content: loaderData.story.excerpt },
          { property: "og:image", content: loaderData.story.img_url ?? "" },
        ]
      : [{ title: "Story — NinetyMinds" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 text-center">
      <h1 className="font-display text-5xl mb-4">Story not found</h1>
      <p className="text-muted-foreground mb-8">The story you are looking for does not exist.</p>
      <Link
        to="/stories"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-cream text-sm font-medium hover:bg-pitch transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Stories
      </Link>
    </div>
  ),
  component: StoryDetailPage,
});

function StoryDetailPage() {
  const { story, allStories } = Route.useLoaderData();
  const related = allStories.filter((s) => s.slug !== story.slug).slice(0, 3);

  return (
    <div className="bg-background">
      {/* Hero */}
      <div className="relative">
        <div className="aspect-[21/9] md:aspect-[21/8] overflow-hidden">
          <img
            src={story.img_url ?? "/assets/hero.jpg"}
            alt={story.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
        </div>
        <div className="absolute bottom-0 inset-x-0 px-6 lg:px-10 pb-10 pt-20">
          <div className="mx-auto max-w-5xl">
            <div className="text-xs uppercase tracking-[0.2em] text-ember mb-3">
              {story.tag} · {story.read_time} read
            </div>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl leading-[1.05] text-cream max-w-4xl text-balance">
              {story.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-6 lg:px-10 py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main article */}
          <article className="lg:col-span-8">
            {/* Author */}
            <div className="flex items-center gap-4 pb-8 mb-8 border-b border-border">
              <img
                src={story.author_avatar ?? "/assets/player-2.jpg"}
                alt={story.author_name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="font-medium">{story.author_name}</div>
                <div className="text-sm text-muted-foreground">{story.author_role}</div>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(story.published_at).toLocaleDateString("en-NG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {story.read_time}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="prose prose-lg max-w-none">
              {story.content.map((paragraph: string, idx: number) => (
                <p
                  key={idx}
                  className={`text-lg leading-relaxed text-foreground/90 ${
                    idx === 0
                      ? "font-display text-2xl md:text-3xl leading-snug text-ink"
                      : "mt-6"
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Pull quote */}
            {story.quote_text && (
              <blockquote className="mt-12 border-l-4 border-ember pl-6 py-2">
                <p className="font-display text-2xl md:text-3xl leading-snug text-ink italic">
                  "{story.quote_text}"
                </p>
                {story.quote_attr && (
                  <cite className="mt-3 block text-sm text-muted-foreground not-italic">
                    — {story.quote_attr}
                  </cite>
                )}
              </blockquote>
            )}

            {/* Back link */}
            <div className="mt-16">
              <Link
                to="/stories"
                className="inline-flex items-center gap-2 text-sm font-medium hover:text-ember transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to all stories
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-10">
              {/* Related stories */}
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-ember mb-5">Related stories</div>
                <div className="space-y-6">
                  {related.map((s) => (
                    <Link
                      key={s.slug}
                      to="/stories/$storyId"
                      params={{ storyId: s.slug }}
                      className="group block"
                    >
                      <div className="aspect-[16/10] overflow-hidden rounded-xl mb-3">
                        <img
                          src={s.img_url ?? "/assets/player-1.jpg"}
                          alt={s.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="text-xs uppercase tracking-[0.2em] text-ember mb-1">
                        {s.tag} · {s.read_time}
                      </div>
                      <h3 className="font-display text-xl leading-tight group-hover:text-pitch transition-colors">
                        {s.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter CTA */}
              <div className="bg-ink text-cream rounded-2xl p-6">
                <h4 className="font-display text-2xl leading-tight mb-2">
                  Stories in your inbox.
                </h4>
                <p className="text-sm text-cream/70 mb-4">
                  Weekly long-form reporting on grassroots football and mental wellness.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="flex-1 min-h-10 px-4 rounded-lg bg-cream/10 border border-cream/20 text-sm placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-ember"
                  />
                  <button className="px-4 py-2 rounded-lg bg-ember text-cream text-sm font-medium hover:opacity-90 transition">
                    Join
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}