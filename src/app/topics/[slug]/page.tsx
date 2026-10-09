
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  topics,
  getTopicBySlug,
  getArticlesByTopic,
} from "@/data/afya";

export const instant = false;

export function generateStaticParams() {
  return topics.map((topic) => ({
    slug: topic.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    return {
      title: "Topic Not Found | Afya Notes",
      description: "The requested health topic could not be found.",
    };
  }

  return {
    title: topic.title,
    description: topic.description,
  };
}

function ArticleCard({
  article,
  accent,
}: {
  article: ReturnType<typeof getArticlesByTopic>[number];
  accent: string;
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#dce7de] bg-white p-5 transition hover:-translate-y-1 hover:border-[#8db99a] hover:shadow-md sm:p-6">
      <span
        className="text-xs font-bold uppercase tracking-[0.12em]"
        style={{ color: accent }}
      >
        {article.category}
      </span>

      <h3 className="mt-3 text-xl font-extrabold leading-snug text-[#193c30]">
        {article.title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-7 text-[#53645b]">
        {article.excerpt}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-[#53645b]">{article.readTime}</span>

        <Link
          href={`/articles/${article.slug}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-[#245b45] bg-[#e8f1e9] px-4 py-2 text-sm font-bold text-[#193c30] transition hover:bg-[#d8e8da] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#218548]/30"
        >
          Read article <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}

function RelatedTopicCard({
  topic,
}: {
  topic: (typeof topics)[number];
}) {
  return (
    <Link
      href={`/topics/${topic.slug}`}
      className="group flex items-start gap-4 rounded-2xl border border-[#dce7de] bg-white p-5 transition hover:border-[#8db99a] hover:shadow-md"
    >
      <span
        aria-hidden="true"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
        style={{
          backgroundColor: topic.softBackground,
          color: topic.accent,
        }}
      >
        {topic.icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-base font-extrabold text-[#193c30]">
          {topic.title}
        </span>

        <span className="mt-1 block text-sm leading-6 text-[#53645b]">
          {topic.description}
        </span>

        <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#17633d]">
          Explore topic
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </span>
    </Link>
  );
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  const topicArticles = getArticlesByTopic(topic.slug);

  const relatedTopics = topics.filter(
    (item) => item.slug !== topic.slug
  );

  return (
    <main className="min-h-screen bg-[#f8faf7] text-[#193c30]">
      <header className="border-b border-[#dce7de] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3"
            aria-label="Afya Notes home"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#218548] text-xl font-black text-white">
              A
            </span>

            <span>
              <span className="block text-lg font-extrabold tracking-tight">
                Afya Notes
              </span>
              <span className="block text-xs text-[#53645b]">
                Clear health information
              </span>
            </span>
          </Link>

          <Link
            href="/#topics"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-[#245b45] bg-[#e8f1e9] px-4 py-2 text-sm font-bold text-[#193c30] transition hover:bg-[#d8e8da] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#218548]/30"
          >
            All topics
          </Link>
        </div>
      </header>

      <section
        className="border-b border-[#dce7de]"
        style={{ backgroundColor: topic.softBackground }}
      >
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-20">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[#53645b]"
          >
            <Link
              href="/"
              className="underline underline-offset-4 hover:text-[#17633d]"
            >
              Home
            </Link>

            <span aria-hidden="true">/</span>

            <Link
              href="/#topics"
              className="underline underline-offset-4 hover:text-[#17633d]"
            >
              Health topics
            </Link>

            <span aria-hidden="true">/</span>

            <span aria-current="page" className="font-semibold text-[#193c30]">
              {topic.title}
            </span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-3xl">
              <p
                className="text-xs font-extrabold uppercase tracking-[0.17em] sm:text-sm"
                style={{ color: topic.accent }}
              >
                Topic {topic.number} · {topic.eyebrow}
              </p>

              <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {topic.title}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-[#40554a] sm:text-lg">
                {topic.description}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="#topic-articles"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-[#17633d] bg-[#218548] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#176b3a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#218548]/30"
                >
                  Explore articles <span aria-hidden="true">↓</span>
                </Link>

                <Link
                  href="/#topics"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-[#245b45] bg-white px-5 py-3 text-sm font-bold text-[#193c30] transition hover:bg-[#f5faf5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#218548]/30"
                >
                  Browse other topics
                </Link>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="flex h-28 w-28 items-center justify-center rounded-3xl border border-white/80 bg-white/80 text-6xl shadow-sm sm:h-36 sm:w-36 sm:text-7xl"
              style={{ color: topic.accent }}
            >
              {topic.icon}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#218548]">
              About this topic
            </p>

            <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
              A clearer understanding starts here.
            </h2>
          </div>

          <div>
            <p className="text-base leading-8 text-[#40554a] sm:text-lg">
              {topic.introduction}
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dce7de] bg-white px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#218548]">
              What you can learn
            </p>

            <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Explore the essentials.
            </h2>
          </div>

          <ul className="mt-7 grid gap-4 sm:grid-cols-2">
            {topic.learningPoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 rounded-2xl border border-[#dce7de] bg-[#f8faf7] p-5"
              >
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                  style={{ backgroundColor: topic.accent }}
                >
                  ✓
                </span>

                <span className="text-sm leading-7 text-[#40554a] sm:text-base">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="topic-articles"
        className="scroll-mt-8 px-5 py-12 sm:px-8 sm:py-16"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#218548]">
            The reading room
          </p>

          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Articles on {topic.title}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#53645b] sm:text-base">
                Explore educational articles related to this category.
              </p>
            </div>

            <span className="self-start rounded-full border border-[#dce7de] bg-white px-4 py-2 text-sm font-semibold text-[#40554a] sm:self-auto">
              {topicArticles.length}{" "}
              {topicArticles.length === 1 ? "article" : "articles"}
            </span>
          </div>

          {topicArticles.length > 0 ? (
            <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {topicArticles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  accent={topic.accent}
                />
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-3xl border border-[#dce7de] bg-white px-6 py-10 text-center sm:px-10 sm:py-14">
              <span
                aria-hidden="true"
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
                style={{
                  backgroundColor: topic.softBackground,
                  color: topic.accent,
                }}
              >
                {topic.icon}
              </span>

              <h3 className="mt-5 text-xl font-extrabold">
                New articles are on the way.
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#53645b] sm:text-base">
                We're building this collection of health information. In the
                meantime, explore our other topics and available educational
                articles.
              </p>

              <Link
                href="/#articles"
                className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-[#17633d] bg-[#218548] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#176b3a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#218548]/30"
              >
                Read available articles <span aria-hidden="true">↗</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-[#dce7de] bg-[#edf5ed] px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Keep exploring.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#53645b] sm:text-base">
            Discover other health categories and continue learning at your own
            pace.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {relatedTopics.map((relatedTopic) => (
              <RelatedTopicCard
                key={relatedTopic.slug}
                topic={relatedTopic}
              />
            ))}
          </div>
        </div>
      </section>

      <aside className="border-t border-[#dce7de] bg-white px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-base font-extrabold">
            An important health reminder
          </h2>

          <p className="mt-2 max-w-4xl text-sm leading-7 text-[#53645b]">
            This website provides general health education, not personal
            medical advice. Information here cannot replace assessment,
            diagnosis, or treatment by a qualified healthcare professional.
            Seek urgent medical care when symptoms are severe or an emergency
            is suspected.
          </p>
        </div>
      </aside>

      <footer className="bg-[#193c30] px-5 py-8 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="text-lg font-extrabold">
              Afya Notes
            </Link>

            <p className="mt-1 text-sm text-[#e1ece3]">
              Clear health information for everyday life.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-5 text-sm font-semibold text-white"
          >
            <Link href="/#topics" className="hover:underline">
              All topics
            </Link>
            <Link href="/#articles" className="hover:underline">
              All articles
            </Link>
            <Link href="/#about" className="hover:underline">
              About
            </Link>
          </nav>
        </div>

        <div className="mx-auto mt-6 max-w-7xl border-t border-white/20 pt-5 text-xs leading-6 text-[#e1ece3]">
          © 2026 Afya Notes. For educational purposes only.
        </div>
      </footer>
    </main>
  );
}
