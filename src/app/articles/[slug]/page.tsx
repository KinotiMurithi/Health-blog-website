
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  articles,
  topics,
  getArticleBySlug,
  getRelatedArticles,
  getTopicBySlug,
} from "@/data/afya";

export const instant = false;

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | Afya Notes",
      description: "The requested health article could not be found.",
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const category = getTopicBySlug(article.categorySlug);
  const relatedArticles = getRelatedArticles(article.slug, 2);

  return (
    <main className="min-h-screen bg-[#f8faf7] text-[#193c30]">
      <header className="border-b border-[#dce7de] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href="/"
            aria-label="Afya Notes home"
            className="inline-flex items-center gap-3"
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
            href="/#articles"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-[#245b45] bg-[#e8f1e9] px-4 py-2 text-sm font-bold text-[#193c30] transition hover:bg-[#d8e8da] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#218548]/30"
          >
            All articles
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
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
            href="/#articles"
            className="underline underline-offset-4 hover:text-[#17633d]"
          >
            Articles
          </Link>

          <span aria-hidden="true">/</span>

          {category ? (
            <Link
              href={`/topics/${category.slug}`}
              className="underline underline-offset-4 hover:text-[#17633d]"
            >
              {article.category}
            </Link>
          ) : (
            <span>{article.category}</span>
          )}

          <span aria-hidden="true">/</span>

          <span aria-current="page" className="font-semibold text-[#193c30]">
            {article.title}
          </span>
        </nav>

        <article>
          <div className="mb-8">
            <Link
              href={`/topics/${article.categorySlug}`}
              className="inline-flex rounded-full border border-[#c9dfcd] bg-[#e4f1e6] px-3 py-1.5 text-sm font-semibold text-[#17633d] transition hover:bg-[#d8e8da]"
            >
              {article.category}
            </Link>

            <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {article.title}
            </h1>

            <p className="mt-5 text-lg leading-8 text-[#53645b]">
              {article.excerpt}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#53645b]">
              <span>{article.publishedAt}</span>
              <span aria-hidden="true">•</span>
              <span>{article.readTime}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#dce7de] bg-white p-5 sm:p-8">
            <p className="text-base leading-8 text-[#40554a] sm:text-lg">
              {article.introduction}
            </p>
          </div>

          <div className="mt-10 space-y-10">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {section.heading}
                </h2>

                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph, index) => (
                    <p
                      key={`${section.heading}-${index}`}
                      className="text-base leading-8 text-[#40554a] sm:text-lg"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-5 space-y-3">
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-3 text-base leading-7 text-[#40554a]"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#218548]"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <aside className="mt-12 rounded-2xl border border-[#c9dfcd] bg-[#edf6ee] p-5 sm:p-7">
            <h2 className="text-lg font-bold">
              Health information disclaimer
            </h2>

            <p className="mt-2 text-sm leading-7 text-[#40554a]">
              This article is for general educational purposes only. It is
              not a substitute for a professional medical assessment,
              diagnosis, or treatment. Seek advice from a qualified healthcare
              professional about your individual circumstances. For emergencies,
              seek urgent medical care.
            </p>
          </aside>
        </article>

        <section className="mt-16 border-t border-[#dce7de] pt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#218548]">
                Keep learning
              </p>

              <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                You might also find these useful.
              </h2>
            </div>

            <Link
              href={`/topics/${article.categorySlug}`}
              className="inline-flex min-h-10 items-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-bold text-[#17633d] transition hover:bg-[#e8f1e9] sm:self-auto"
            >
              More in {article.category}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {relatedArticles.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {relatedArticles.map((relatedArticle) => {
                const relatedTopic = getTopicBySlug(
                  relatedArticle.categorySlug
                );

                return (
                  <article
                    key={relatedArticle.slug}
                    className="flex h-full flex-col rounded-2xl border border-[#dce7de] bg-white p-5 transition hover:border-[#8db99a] hover:shadow-md"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#218548]">
                      {relatedArticle.category}
                    </p>

                    <h3 className="mt-3 text-lg font-extrabold leading-snug">
                      {relatedArticle.title}
                    </h3>

                    <p className="mt-3 flex-1 text-sm leading-7 text-[#53645b]">
                      {relatedArticle.excerpt}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs text-[#53645b]">
                        {relatedArticle.readTime}
                      </span>

                      <Link
                        href={`/articles/${relatedArticle.slug}`}
                        className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-[#17633d] transition hover:bg-[#e8f1e9]"
                      >
                        Read article
                        <span aria-hidden="true">↗</span>
                      </Link>
                    </div>

                    {relatedTopic && (
                      <Link
                        href={`/topics/${relatedTopic.slug}`}
                        className="mt-2 self-start text-xs font-semibold text-[#53645b] underline underline-offset-4 hover:text-[#17633d]"
                      >
                        Explore {relatedTopic.title}
                      </Link>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="mt-5 text-sm leading-7 text-[#53645b]">
              More articles are being prepared for this collection.
            </p>
          )}
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/topics/${article.categorySlug}`}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-[#245b45] bg-[#e8f1e9] px-5 py-3 text-sm font-bold text-[#193c30] transition hover:bg-[#d8e8da] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#218548]/30"
          >
            ← Back to {article.category}
          </Link>

          <Link
            href="/#articles"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-[#17633d] bg-[#218548] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#176b3a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#218548]/30"
          >
            Browse all articles
          </Link>
        </div>
      </div>

      <footer className="border-t border-[#dce7de] bg-[#193c30] px-5 py-8 text-white sm:px-8">
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

        <div className="mx-auto mt-6 max-w-7xl border-t border-white/20 pt-5 text-xs leading-6 text-[#e1ece3]">
          © 2026 Afya Notes. For educational purposes only.
        </div>
      </footer>
    </main>
  );
}
