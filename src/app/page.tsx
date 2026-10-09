
import Link from "next/link";
import {
  topics,
  getFeaturedArticles,
} from "@/data/afya";

const primaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-[#17633d] bg-[#218548] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#176b3a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#218548]/30";

const secondaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-[#245b45] bg-[#e8f1e9] px-5 py-3 text-sm font-bold text-[#193c30] transition hover:bg-[#d8e8da] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#218548]/30";

const featuredArticles = getFeaturedArticles();

function Brand() {
  return (
    <Link
      href="/"
      aria-label="Afya Notes home"
      className="inline-flex items-center gap-3"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#218548] text-xl font-black text-white">
        A
      </span>

      <span>
        <span className="block text-lg font-extrabold tracking-tight text-[#193c30]">
          Afya Notes
        </span>
        <span className="block text-xs text-[#53645b]">
          Clear health information
        </span>
      </span>
    </Link>
  );
}

function TopicCard({
  topic,
}: {
  topic: (typeof topics)[number];
}) {
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-[#dce7de] bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-[#8db99a] hover:shadow-lg sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <span className="text-sm font-extrabold tracking-[0.18em] text-[#718176]">
          {topic.number}
        </span>

        <span
          aria-hidden="true"
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
          style={{
            backgroundColor: topic.softBackground,
            color: topic.accent,
          }}
        >
          {topic.icon}
        </span>
      </div>

      <p
        className="mt-7 text-xs font-bold uppercase tracking-[0.12em]"
        style={{ color: topic.accent }}
      >
        {topic.eyebrow}
      </p>

      <h3 className="mt-3 text-xl font-extrabold leading-snug tracking-tight text-[#193c30] sm:text-2xl">
        {topic.title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-7 text-[#53645b] sm:text-base">
        {topic.description}
      </p>

      <Link
        href={`/topics/${topic.slug}`}
        className="mt-7 inline-flex min-h-12 items-center justify-between gap-3 rounded-xl border-2 border-[#245b45] bg-[#e8f1e9] px-4 py-3 text-sm font-bold text-[#193c30] transition hover:border-[#17633d] hover:bg-[#d8e8da] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#218548]/30"
      >
        <span>Explore topic</span>
        <span
          aria-hidden="true"
          className="text-lg transition-transform group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
    </article>
  );
}

function ArticleCard({
  article,
}: {
  article: (typeof featuredArticles)[number];
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#dce7de] bg-white p-5 transition hover:border-[#8db99a] hover:shadow-md sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#218548]">
        {article.category}
      </p>

      <h3 className="mt-3 text-xl font-extrabold leading-snug text-[#193c30]">
        {article.title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-7 text-[#53645b]">
        {article.excerpt}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-xs text-[#53645b]">{article.readTime}</span>

        <Link
          href={`/articles/${article.slug}`}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-[#17633d] transition hover:bg-[#e8f1e9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#218548]"
        >
          Read article <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8faf7] text-[#193c30]">
      <header className="sticky top-0 z-20 border-b border-[#dce7de] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Brand />

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 md:flex"
          >
            <Link
              href="/#topics"
              className="text-sm font-semibold text-[#40554a] transition hover:text-[#218548]"
            >
              Health topics
            </Link>

            <Link
              href="/#articles"
              className="text-sm font-semibold text-[#40554a] transition hover:text-[#218548]"
            >
              Articles
            </Link>

            <Link
              href="/#about"
              className="text-sm font-semibold text-[#40554a] transition hover:text-[#218548]"
            >
              About
            </Link>
          </nav>

          <div className="hidden md:block">
            <Link href="/#articles" className={primaryButton}>
              Explore articles <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <details className="relative md:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-center rounded-xl border-2 border-[#245b45] bg-[#e8f1e9] px-4 text-sm font-bold text-[#193c30]">
              Menu <span className="ml-2" aria-hidden="true">☰</span>
            </summary>

            <nav
              aria-label="Mobile navigation"
              className="absolute right-0 top-14 flex w-56 flex-col gap-1 rounded-2xl border border-[#dce7de] bg-white p-3 shadow-xl"
            >
              <Link
                href="/#topics"
                className="rounded-lg px-4 py-3 text-sm font-semibold hover:bg-[#e8f1e9]"
              >
                Health topics
              </Link>

              <Link
                href="/#articles"
                className="rounded-lg px-4 py-3 text-sm font-semibold hover:bg-[#e8f1e9]"
              >
                Articles
              </Link>

              <Link
                href="/#about"
                className="rounded-lg px-4 py-3 text-sm font-semibold hover:bg-[#e8f1e9]"
              >
                About
              </Link>
            </nav>
          </details>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#dce7de] bg-[#edf5ed]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border-[48px] border-[#dcebdc] sm:h-[30rem] sm:w-[30rem]"
        />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c8dfcb] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.13em] text-[#17633d] sm:text-sm">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-[#218548]"
              />
              Health knowledge for everyone
            </span>

            <h1 className="mt-7 max-w-3xl text-4xl font-extrabold leading-[1.12] tracking-tight text-[#193c30] sm:text-5xl lg:text-7xl">
              Health topics
              <br />
              <span className="text-[#218548]">that matter.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#40554a] sm:text-lg sm:leading-9">
              Explore practical information for your health, your family, and
              your community. Clear explanations to help you make informed
              everyday health decisions.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/#articles" className={primaryButton}>
                Explore all articles <span aria-hidden="true">↗</span>
              </Link>

              <Link href="/#topics" className={secondaryButton}>
                Browse health topics <span aria-hidden="true">↓</span>
              </Link>
            </div>

            <p className="mt-5 text-xs leading-6 text-[#53645b]">
              Reliable health education. Clear language. Informed choices.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-3xl bg-[#218548] p-5 text-white sm:p-7">
              <span className="text-3xl sm:text-4xl" aria-hidden="true">
                ✳
              </span>
              <h2 className="mt-8 text-lg font-extrabold sm:text-xl">
                Understand
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/90">
                Make sense of health information.
              </p>
            </div>

            <div className="mt-8 rounded-3xl border border-[#dce7de] bg-white p-5 sm:mt-12 sm:p-7">
              <span className="text-3xl text-[#218548] sm:text-4xl" aria-hidden="true">
                ♡
              </span>
              <h2 className="mt-8 text-lg font-extrabold sm:text-xl">
                Care
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#53645b]">
                Support yourself and your family.
              </p>
            </div>

            <div className="rounded-3xl border border-[#dce7de] bg-white p-5 sm:p-7">
              <span className="text-3xl text-[#218548] sm:text-4xl" aria-hidden="true">
                +
              </span>
              <h2 className="mt-8 text-lg font-extrabold sm:text-xl">
                Prevent
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#53645b]">
                Learn about prevention and wellbeing.
              </p>
            </div>

            <div className="mt-8 rounded-3xl bg-[#e5eee2] p-5 sm:mt-12 sm:p-7">
              <span className="text-3xl text-[#17633d] sm:text-4xl" aria-hidden="true">
                ↗
              </span>
              <h2 className="mt-8 text-lg font-extrabold sm:text-xl">
                Take action
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#40554a]">
                Know when to seek professional care.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="topics"
        className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#218548] sm:text-sm">
                Explore by category
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Health topics that matter.
              </h2>

              <p className="mt-4 max-w-xl text-base leading-8 text-[#53645b]">
                Start with what matters to you. Explore clear, practical
                information designed for everyday life.
              </p>
            </div>

            <Link
              href="/#articles"
              className={`${secondaryButton} self-start md:self-auto`}
            >
              View all articles <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {topics.map((topic) => (
              <TopicCard key={topic.slug} topic={topic} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="articles"
        className="scroll-mt-24 border-y border-[#dce7de] bg-white px-5 py-16 sm:px-8 sm:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#218548] sm:text-sm">
              Read and learn
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Explore our latest articles.
            </h2>

            <p className="mt-4 text-base leading-8 text-[#53645b]">
              Accessible health information to help you understand common
              conditions, care for your family, and make informed choices.
            </p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="about"
        className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-8 rounded-3xl border border-[#dce7de] bg-[#edf5ed] p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-14">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#218548] sm:text-sm">
              About Afya Notes
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Better health decisions start with better information.
            </h2>

            <p className="mt-4 text-base leading-8 text-[#40554a]">
              Afya Notes is designed to make health education approachable,
              useful, and easier to understand. Our aim is to help readers
              learn about health while recognising when professional medical
              advice is needed.
            </p>
          </div>

          <Link href="/#topics" className={primaryButton}>
            Explore health topics <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <footer className="bg-[#193c30] px-5 py-10 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="text-xl font-extrabold tracking-tight text-white"
            >
              Afya Notes
            </Link>

            <p className="mt-2 max-w-md text-sm leading-6 text-[#e1ece3]">
              Clear health information for you, your family, and your community.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-white"
          >
            <Link href="/#topics" className="hover:underline">
              Topics
            </Link>
            <Link href="/#articles" className="hover:underline">
              Articles
            </Link>
            <Link href="/#about" className="hover:underline">
              About
            </Link>
          </nav>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-white/20 pt-5 text-xs leading-6 text-[#e1ece3]">
          <p>© 2026 Afya Notes. For educational purposes only.</p>
          <p className="mt-1">
            Health information on this website is not a substitute for
            professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </footer>
    </main>
  );
}
