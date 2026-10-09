
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  topics,
  articles as sampleArticles,
} from "@/data/afya";
import type { Article } from "@/data/afya";
import {
  createArticleRecord,
  loadAdminArticles,
  saveAdminArticles,
} from "@/lib/afya-admin-store";
import type {
  AdminArticle,
  ArticleStatus,
} from "@/lib/afya-admin-store";

type View = "overview" | "articles" | "categories";
type StatusFilter = "All" | ArticleStatus;

type EditorForm = {
  title: string;
  slug: string;
  categorySlug: string;
  excerpt: string;
  readTime: string;
  introduction: string;
  body: string;
  status: ArticleStatus;
};

const buttonPrimary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-2 border-[#17633d] bg-[#218548] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#176b3a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#218548]/30 disabled:cursor-not-allowed disabled:opacity-50";

const buttonSecondary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#cbd9ce] bg-white px-4 py-2.5 text-sm font-bold text-[#193c30] transition hover:bg-[#edf5ed] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#218548]/20";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function todayLabel() {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function serializeSections(article: Article) {
  return article.sections
    .map((section) => {
      const paragraphs = section.paragraphs.join("\n\n");
      const bullets = section.bullets?.length
        ? `\n\n${section.bullets.map((bullet) => `- ${bullet}`).join("\n")}`
        : "";

      return `## ${section.heading}\n${paragraphs}${bullets}`;
    })
    .join("\n\n");
}

function parseSections(body: string): Article["sections"] {
  const blocks = body
    .split(/(?=^##\s)/m)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return [
      {
        heading: "Key information",
        paragraphs: ["More information will be added to this article."],
      },
    ];
  }

  return blocks.map((block) => {
    const lines = block.split("\n");
    let heading = "Key information";

    if (lines[0]?.startsWith("## ")) {
      heading = lines.shift()!.replace(/^##\s+/, "").trim();
    }

    const content = lines.join("\n").trim();
    const chunks = content
      .split(/\n\s*\n/)
      .map((chunk) => chunk.trim())
      .filter(Boolean);

    const paragraphs: string[] = [];
    const bullets: string[] = [];

    for (const chunk of chunks) {
      const chunkLines = chunk.split("\n").map((line) => line.trim());

      if (chunkLines.every((line) => line.startsWith("- "))) {
        bullets.push(
          ...chunkLines.map((line) => line.replace(/^-\s+/, ""))
        );
      } else {
        paragraphs.push(
          chunkLines
            .map((line) => line.replace(/\s+/g, " "))
            .join(" ")
        );
      }
    }

    return {
      heading: heading || "Key information",
      paragraphs,
      ...(bullets.length > 0 ? { bullets } : {}),
    };
  });
}

function createEmptyForm(): EditorForm {
  return {
    title: "",
    slug: "",
    categorySlug: topics[0]?.slug ?? "health-education",
    excerpt: "",
    readTime: "5 min read",
    introduction: "",
    body: "## Overview\n\nWrite your article content here.",
    status: "Draft",
  };
}

function formFromArticle(article: AdminArticle): EditorForm {
  return {
    title: article.title,
    slug: article.slug,
    categorySlug: article.categorySlug,
    excerpt: article.excerpt,
    readTime: article.readTime,
    introduction: article.introduction,
    body: serializeSections(article),
    status: article.status,
  };
}

function articleFromForm(
  form: EditorForm,
  existing?: AdminArticle
): Article {
  const category = topics.find(
    (topic) => topic.slug === form.categorySlug
  );

  return {
    slug: slugify(form.slug || form.title),
    title: form.title.trim(),
    category: category?.title ?? "Health Education",
    categorySlug: category?.slug ?? "health-education",
    excerpt: form.excerpt.trim(),
    readTime: form.readTime.trim() || "5 min read",
    publishedAt: existing?.publishedAt ?? todayLabel(),
    introduction: form.introduction.trim(),
    sections: parseSections(form.body),
    featured: existing?.featured ?? false,
  };
}

function StatusBadge({ status }: { status: ArticleStatus }) {
  const published = status === "Published";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
        published
          ? "bg-[#e4f4e7] text-[#17633d]"
          : "bg-[#fff2d8] text-[#865b12]"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${
          published ? "bg-[#218548]" : "bg-[#c28a21]"
        }`}
      />
      {status}
    </span>
  );
}

function StatCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: number;
  detail: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-[#dce7de] bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-[#53645b]">{label}</p>
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf5ed] text-xl text-[#17633d]"
        >
          {icon}
        </span>
      </div>

      <p className="mt-4 text-3xl font-extrabold tracking-tight text-[#193c30]">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-[#718176]">{detail}</p>
    </div>
  );
}

export default function AdminPage() {
  const [records, setRecords] = useState<AdminArticle[]>([]);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>("overview");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EditorForm>(createEmptyForm);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const [notice, setNotice] = useState("");
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    setRecords(loadAdminArticles());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    setStorageError(!saveAdminArticles(records));
  }, [records, ready]);

  const publishedCount = records.filter(
    (article) => article.status === "Published"
  ).length;

  const draftCount = records.filter(
    (article) => article.status === "Draft"
  ).length;

  const filteredArticles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return records.filter((article) => {
      const matchesSearch =
        !normalizedSearch ||
        article.title.toLowerCase().includes(normalizedSearch) ||
        article.slug.toLowerCase().includes(normalizedSearch) ||
        article.excerpt.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" || article.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        article.categorySlug === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [records, search, statusFilter, categoryFilter]);

  function openNewArticle() {
    setEditingId(null);
    setForm(createEmptyForm());
    setPreviewArticle(null);
    setEditorOpen(true);
    setNotice("");
  }

  function openEditor(article: AdminArticle) {
    setEditingId(article.id);
    setForm(formFromArticle(article));
    setPreviewArticle(null);
    setEditorOpen(true);
    setNotice("");
  }

  function updateForm<K extends keyof EditorForm>(
    key: K,
    value: EditorForm[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function saveArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const slug = slugify(form.slug || form.title);

    if (!form.title.trim() || !slug || !form.excerpt.trim()) {
      setNotice("Please enter an article title, URL slug, and summary.");
      return;
    }

    if (!form.introduction.trim()) {
      setNotice("Please enter an article introduction.");
      return;
    }

    const duplicate = records.find(
      (article) =>
        article.slug === slug && article.id !== editingId
    );

    if (duplicate) {
      setNotice(
        "That URL slug is already in use. Choose a different slug."
      );
      return;
    }

    const content = articleFromForm({ ...form, slug });
    let updated: AdminArticle[];

    if (editingId) {
      const existing = records.find(
        (article) => article.id === editingId
      );

      if (!existing) {
        setNotice("This article could not be found. Please reopen it.");
        return;
      }

      const updatedArticle: AdminArticle = {
        ...content,
        id: existing.id,
        status: form.status,
        updatedAt: todayLabel(),
      };

      updated = records.map((article) =>
        article.id === editingId ? updatedArticle : article
      );
    } else {
      const newArticle = createArticleRecord(content, form.status);
      updated = [newArticle, ...records];
    }

    setRecords(updated);
    setEditorOpen(false);
    setPreviewArticle(null);
    setNotice("");

    setView("articles");
  }

  function toggleStatus(article: AdminArticle) {
    const nextStatus: ArticleStatus =
      article.status === "Published" ? "Draft" : "Published";

    setRecords((current) =>
      current.map((item) =>
        item.id === article.id
          ? {
              ...item,
              status: nextStatus,
              updatedAt: todayLabel(),
            }
          : item
      )
    );

    setNotice(
      nextStatus === "Published"
        ? `"${article.title}" marked as published in this prototype.`
        : `"${article.title}" moved to drafts in this prototype.`
    );
  }

  function deleteArticle(article: AdminArticle) {
    const confirmed = window.confirm(
      `Delete "${article.title}" from this browser's prototype data? This cannot be undone.`
    );

    if (!confirmed) return;

    setRecords((current) =>
      current.filter((item) => item.id !== article.id)
    );

    setNotice(`"${article.title}" was deleted from the prototype.`);
  }

  function openFormPreview() {
    if (!form.title.trim() || !form.introduction.trim()) {
      setNotice("Add a title and introduction before previewing.");
      return;
    }

    setPreviewArticle(articleFromForm(form));
  }

  const navItems: { id: View; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "▦" },
    { id: "articles", label: "Articles", icon: "▤" },
    { id: "categories", label: "Categories", icon: "◇" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f8f4] text-[#193c30]">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-[#dce7de] bg-white lg:flex">
          <Link
            href="/"
            className="flex items-center gap-3 border-b border-[#e7eee7] px-6 py-6"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#218548] text-xl font-black text-white">
              A
            </span>

            <span>
              <span className="block text-lg font-extrabold tracking-tight">
                Afya Notes
              </span>
              <span className="block text-xs text-[#718176]">
                Content studio
              </span>
            </span>
          </Link>

          <div className="px-4 pt-7">
            <p className="px-3 text-[11px] font-extrabold uppercase tracking-[0.17em] text-[#87948a]">
              Workspace
            </p>

            <nav className="mt-3 space-y-1" aria-label="Admin navigation">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setView(item.id);
                    setNotice("");
                  }}
                  className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition ${
                    view === item.id
                      ? "bg-[#e8f3e9] text-[#17633d]"
                      : "text-[#53645b] hover:bg-[#f5f8f4]"
                  }`}
                >
                  <span aria-hidden="true" className="text-lg">
                    {item.icon}
                  </span>
                  {item.label}
                  {item.id === "articles" && (
                    <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs text-[#53645b]">
                      {records.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto border-t border-[#e7eee7] p-5">
            <div className="rounded-2xl bg-[#edf5ed] p-4">
              <p className="text-sm font-extrabold">Prototype mode</p>
              <p className="mt-2 text-xs leading-5 text-[#53645b]">
                Your articles are stored in this browser. Backend
                authentication and shared publishing are not connected yet.
              </p>
            </div>

            <Link
              href="/"
              className="mt-4 inline-flex min-h-10 items-center gap-2 px-2 text-sm font-semibold text-[#53645b] hover:text-[#17633d]"
            >
              <span aria-hidden="true">←</span> View public website
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-[#dce7de] bg-white/95 backdrop-blur">
            <div className="mx-auto flex min-h-[76px] max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-7 lg:px-10">
              <div className="flex min-w-0 items-center gap-3">
                <Link
                  href="/"
                  aria-label="Afya Notes home"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#218548] text-lg font-black text-white lg:hidden"
                >
                  A
                </Link>

                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[#718176]">
                    Afya Notes / Admin
                  </p>
                  <h1 className="truncate text-lg font-extrabold sm:text-xl">
                    {view === "overview"
                      ? "Overview"
                      : view === "articles"
                        ? "Article management"
                        : "Categories"}
                  </h1>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <Link
                  href="/"
                  className="hidden min-h-10 items-center rounded-xl px-3 text-sm font-semibold text-[#53645b] transition hover:bg-[#edf5ed] sm:inline-flex"
                >
                  View website ↗
                </Link>

                <button
                  type="button"
                  onClick={openNewArticle}
                  className={buttonPrimary}
                >
                  <span aria-hidden="true">+</span>
                  <span className="hidden sm:inline">New article</span>
                  <span className="sm:hidden">New</span>
                </button>
              </div>
            </div>

            <nav
              aria-label="Mobile admin navigation"
              className="flex gap-2 overflow-x-auto border-t border-[#edf1ed] px-4 py-2 lg:hidden"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setView(item.id);
                    setNotice("");
                  }}
                  className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold ${
                    view === item.id
                      ? "bg-[#e8f3e9] text-[#17633d]"
                      : "text-[#53645b] hover:bg-[#f5f8f4]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </header>

          <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-7 sm:py-8 lg:px-10">
            {storageError && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-[#e7c1a7] bg-[#fff3e9] p-4 text-sm text-[#81441e]"
              >
                Your browser could not save the latest changes. Check its
                storage settings or available space before continuing.
              </div>
            )}

            {notice && (
              <div
                role="status"
                className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-[#c9dfcd] bg-[#edf6ee] p-4 text-sm text-[#245b45]"
              >
                <span>{notice}</span>
                <button
                  type="button"
                  aria-label="Dismiss message"
                  onClick={() => setNotice("")}
                  className="shrink-0 font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {!ready ? (
              <div className="rounded-2xl border border-[#dce7de] bg-white p-10 text-center text-sm text-[#53645b]">
                Loading your content workspace…
              </div>
            ) : (
              <>
                {view === "overview" && (
                  <section>
                    <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#218548]">
                          Your content at a glance
                        </p>
                        <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                          Welcome to your content studio.
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-7 text-[#53645b]">
                          Manage health education articles and prepare
                          content for publication.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={openNewArticle}
                        className={`${buttonPrimary} self-start sm:self-auto`}
                      >
                        + Create article
                      </button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      <StatCard
                        label="Total articles"
                        value={records.length}
                        detail="All articles in this browser"
                        icon="▤"
                      />
                      <StatCard
                        label="Published"
                        value={publishedCount}
                        detail="Marked as published in the prototype"
                        icon="✓"
                      />
                      <StatCard
                        label="Drafts"
                        value={draftCount}
                        detail="Content still being prepared"
                        icon="✎"
                      />
                      <StatCard
                        label="Categories"
                        value={topics.length}
                        detail="Health topic collections"
                        icon="◇"
                      />
                    </div>

                    <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
                      <section className="overflow-hidden rounded-2xl border border-[#dce7de] bg-white">
                        <div className="flex items-center justify-between gap-3 border-b border-[#e7eee7] px-5 py-5 sm:px-6">
                          <div>
                            <h3 className="font-extrabold">
                              Recently updated
                            </h3>
                            <p className="mt-1 text-xs text-[#718176]">
                              Your latest content changes
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => setView("articles")}
                            className="text-sm font-bold text-[#17633d] hover:underline"
                          >
                            View all
                          </button>
                        </div>

                        {records.length > 0 ? (
                          <div className="divide-y divide-[#edf1ed]">
                            {[...records]
                              .sort((a, b) =>
                                b.updatedAt.localeCompare(a.updatedAt)
                              )
                              .slice(0, 5)
                              .map((article) => (
                                <div
                                  key={article.id}
                                  className="flex items-start justify-between gap-3 px-5 py-4 sm:px-6"
                                >
                                  <div className="min-w-0">
                                    <p className="font-bold leading-6">
                                      {article.title}
                                    </p>
                                    <p className="mt-1 text-xs text-[#718176]">
                                      {article.category} · Updated{" "}
                                      {article.updatedAt}
                                    </p>
                                  </div>

                                  <div className="flex shrink-0 flex-col items-end gap-2">
                                    <StatusBadge status={article.status} />
                                    <button
                                      type="button"
                                      onClick={() => openEditor(article)}
                                      className="text-xs font-bold text-[#17633d] hover:underline"
                                    >
                                      Edit
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <p className="p-6 text-sm text-[#53645b]">
                            No articles yet. Create your first article to
                            get started.
                          </p>
                        )}
                      </section>

                      <section className="rounded-2xl border border-[#dce7de] bg-white p-5 sm:p-6">
                        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#218548]">
                          Quick actions
                        </p>

                        <h3 className="mt-3 text-xl font-extrabold">
                          Keep your content moving.
                        </h3>

                        <div className="mt-5 space-y-3">
                          <button
                            type="button"
                            onClick={openNewArticle}
                            className="flex min-h-14 w-full items-center gap-3 rounded-xl border border-[#dce7de] p-4 text-left transition hover:bg-[#f5f8f4]"
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f3e9] text-lg text-[#17633d]">
                              +
                            </span>
                            <span>
                              <span className="block text-sm font-bold">
                                Write an article
                              </span>
                              <span className="mt-1 block text-xs text-[#718176]">
                                Start a new draft
                              </span>
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setStatusFilter("Draft");
                              setCategoryFilter("All");
                              setSearch("");
                              setView("articles");
                            }}
                            className="flex min-h-14 w-full items-center gap-3 rounded-xl border border-[#dce7de] p-4 text-left transition hover:bg-[#f5f8f4]"
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff2d8] text-lg text-[#865b12]">
                              ✎
                            </span>
                            <span>
                              <span className="block text-sm font-bold">
                                Review drafts
                              </span>
                              <span className="mt-1 block text-xs text-[#718176]">
                                Continue unfinished content
                              </span>
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setView("categories")}
                            className="flex min-h-14 w-full items-center gap-3 rounded-xl border border-[#dce7de] p-4 text-left transition hover:bg-[#f5f8f4]"
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#edf0fa] text-lg text-[#495da0]">
                              ◇
                            </span>
                            <span>
                              <span className="block text-sm font-bold">
                                Browse categories
                              </span>
                              <span className="mt-1 block text-xs text-[#718176]">
                                See your topic collections
                              </span>
                            </span>
                          </button>
                        </div>
                      </section>
                    </div>
                  </section>
                )}

                {view === "articles" && (
                  <section>
                    <div className="mb-7">
                      <p className="text-sm font-semibold text-[#218548]">
                        Content library
                      </p>
                      <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                        Manage articles
                      </h2>
                      <p className="mt-2 text-sm leading-7 text-[#53645b]">
                        Search, edit, preview, and manage your article
                        drafts.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#dce7de] bg-white p-4 sm:p-5">
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_180px_220px_auto]">
                        <label className="block">
                          <span className="mb-2 block text-xs font-bold text-[#53645b]">
                            Search articles
                          </span>
                          <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search by title or keyword…"
                            className="min-h-11 w-full rounded-xl border border-[#cbd9ce] bg-white px-3 text-sm outline-none transition placeholder:text-[#8b988e] focus:border-[#218548] focus:ring-4 focus:ring-[#218548]/10"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-xs font-bold text-[#53645b]">
                            Publication status
                          </span>
                          <select
                            value={statusFilter}
                            onChange={(event) =>
                              setStatusFilter(event.target.value as StatusFilter)
                            }
                            className="min-h-11 w-full rounded-xl border border-[#cbd9ce] bg-white px-3 text-sm outline-none focus:border-[#218548] focus:ring-4 focus:ring-[#218548]/10"
                          >
                            <option value="All">All statuses</option>
                            <option value="Published">Published</option>
                            <option value="Draft">Drafts</option>
                          </select>
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-xs font-bold text-[#53645b]">
                            Category
                          </span>
                          <select
                            value={categoryFilter}
                            onChange={(event) =>
                              setCategoryFilter(event.target.value)
                            }
                            className="min-h-11 w-full rounded-xl border border-[#cbd9ce] bg-white px-3 text-sm outline-none focus:border-[#218548] focus:ring-4 focus:ring-[#218548]/10"
                          >
                            <option value="All">All categories</option>
                            {topics.map((topic) => (
                              <option key={topic.slug} value={topic.slug}>
                                {topic.title}
                              </option>
                            ))}
                          </select>
                        </label>

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => {
                              setSearch("");
                              setStatusFilter("All");
                              setCategoryFilter("All");
                            }}
                            className={`${buttonSecondary} w-full`}
                          >
                            Clear filters
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#edf1ed] pt-4">
                        <p className="text-xs text-[#718176]">
                          Showing {filteredArticles.length} of {records.length}{" "}
                          articles
                        </p>
                        <button
                          type="button"
                          onClick={openNewArticle}
                          className="text-sm font-bold text-[#17633d] hover:underline"
                        >
                          + Add article
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-2xl border border-[#dce7de] bg-white">
                      {filteredArticles.length > 0 ? (
                        <div className="divide-y divide-[#edf1ed]">
                          {filteredArticles.map((article) => (
                            <article
                              key={article.id}
                              className="p-4 sm:p-5"
                            >
                              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <StatusBadge status={article.status} />
                                    <span className="text-xs font-semibold text-[#718176]">
                                      {article.category}
                                    </span>
                                  </div>

                                  <h3 className="mt-2 text-base font-extrabold leading-6 sm:text-lg">
                                    {article.title}
                                  </h3>

                                  <p className="mt-1 break-words text-xs text-[#718176]">
                                    /articles/{article.slug}
                                  </p>

                                  <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-[#53645b]">
                                    {article.excerpt}
                                  </p>

                                  <p className="mt-2 text-xs text-[#718176]">
                                    Updated {article.updatedAt} ·{" "}
                                    {article.readTime}
                                  </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                                  <button
                                    type="button"
                                    onClick={() => openEditor(article)}
                                    className={buttonSecondary}
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setPreviewArticle(article)
                                    }
                                    className={buttonSecondary}
                                  >
                                    Preview
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => toggleStatus(article)}
                                    className={buttonSecondary}
                                  >
                                    {article.status === "Published"
                                      ? "Unpublish"
                                      : "Publish"}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => deleteArticle(article)}
                                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#e6c6c1] bg-white px-4 py-2.5 text-sm font-bold text-[#a43e35] transition hover:bg-[#fff0ed]"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>
                      ) : (
                        <div className="px-6 py-14 text-center">
                          <span className="text-3xl" aria-hidden="true">
                            ▤
                          </span>
                          <h3 className="mt-4 font-extrabold">
                            No articles found
                          </h3>
                          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#53645b]">
                            Try a different search or filter, or create a
                            new article.
                          </p>
                          <button
                            type="button"
                            onClick={openNewArticle}
                            className={`${buttonPrimary} mt-5`}
                          >
                            + Create article
                          </button>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {view === "categories" && (
                  <section>
                    <div className="mb-7">
                      <p className="text-sm font-semibold text-[#218548]">
                        Content organisation
                      </p>
                      <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                        Health categories
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm leading-7 text-[#53645b]">
                        Browse the four health topic collections and see
                        how your current articles are distributed.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {topics.map((topic) => {
                        const categoryArticles = records.filter(
                          (article) =>
                            article.categorySlug === topic.slug
                        );

                        return (
                          <article
                            key={topic.slug}
                            className="flex h-full flex-col rounded-2xl border border-[#dce7de] bg-white p-5 sm:p-6"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <span
                                className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                                style={{
                                  backgroundColor: topic.softBackground,
                                  color: topic.accent,
                                }}
                                aria-hidden="true"
                              >
                                {topic.icon}
                              </span>

                              <span className="rounded-full bg-[#f2f5f1] px-3 py-1 text-xs font-bold text-[#53645b]">
                                {categoryArticles.length}{" "}
                                {categoryArticles.length === 1
                                  ? "article"
                                  : "articles"}
                              </span>
                            </div>

                            <p className="mt-5 text-xs font-bold uppercase tracking-[0.13em] text-[#718176]">
                              Topic {topic.number}
                            </p>

                            <h3 className="mt-2 text-xl font-extrabold">
                              {topic.title}
                            </h3>

                            <p className="mt-3 flex-1 text-sm leading-7 text-[#53645b]">
                              {topic.description}
                            </p>

                            <button
                              type="button"
                              onClick={() => {
                                setCategoryFilter(topic.slug);
                                setStatusFilter("All");
                                setSearch("");
                                setView("articles");
                              }}
                              className={`${buttonSecondary} mt-5 w-full`}
                            >
                              View articles →
                            </button>
                          </article>
                        );
                      })}
                    </div>

                    <div className="mt-6 rounded-2xl border border-[#dce7de] bg-white p-5">
                      <h3 className="font-extrabold">
                        About category management
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-[#53645b]">
                        These four categories are currently defined in the
                        shared frontend data file. You can assign articles
                        to them in the editor. Creating, renaming, or
                        deleting categories themselves will be connected to
                        persistent content management when the backend is
                        developed.
                      </p>
                    </div>
                  </section>
                )}
              </>
            )}
          </main>

          <footer className="border-t border-[#dce7de] bg-white px-4 py-5 sm:px-7 lg:px-10">
            <div className="mx-auto flex max-w-[1600px] flex-col gap-2 text-xs text-[#718176] sm:flex-row sm:items-center sm:justify-between">
              <span>Afya Notes Content Studio</span>
              <span>Frontend prototype · No backend connected</span>
            </div>
          </footer>
        </div>
      </div>

      {editorOpen && (
        <div
          className="fixed inset-0 z-40 overflow-y-auto bg-[#10251b]/50 p-3 backdrop-blur-sm sm:p-6"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setEditorOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-editor-title"
            className="mx-auto my-3 max-w-4xl overflow-hidden rounded-2xl border border-[#dce7de] bg-[#f8faf7] shadow-2xl sm:my-8"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#dce7de] bg-white px-5 py-5 sm:px-7">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#218548]">
                  Content editor
                </p>
                <h2
                  id="article-editor-title"
                  className="mt-2 text-xl font-extrabold sm:text-2xl"
                >
                  {editingId ? "Edit article" : "Create an article"}
                </h2>
                <p className="mt-1 text-sm text-[#53645b]">
                  Fill in the fields below to prepare your article.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditorOpen(false);
                  setPreviewArticle(null);
                }}
                aria-label="Close editor"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#dce7de] bg-white text-lg hover:bg-[#edf5ed]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveArticle}>
              <div className="space-y-5 p-5 sm:p-7">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-bold">
                      Article title *
                    </span>
                    <input
                      required
                      maxLength={160}
                      value={form.title}
                      onChange={(event) => {
                        const title = event.target.value;
                        setForm((current) => ({
                          ...current,
                          title,
                          slug:
                            !editingId ||
                            current.slug === slugify(current.title)
                              ? slugify(title)
                              : current.slug,
                        }));
                      }}
                      placeholder="e.g. Understanding Healthy Sleep"
                      className="min-h-12 w-full rounded-xl border border-[#cbd9ce] bg-white px-4 text-sm outline-none focus:border-[#218548] focus:ring-4 focus:ring-[#218548]/10"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-bold">
                      URL slug *
                    </span>
                    <div className="flex min-h-12 items-center overflow-hidden rounded-xl border border-[#cbd9ce] bg-white focus-within:border-[#218548] focus-within:ring-4 focus-within:ring-[#218548]/10">
                      <span className="hidden shrink-0 border-r border-[#e7eee7] bg-[#f5f8f4] px-3 py-3 text-xs text-[#718176] sm:block">
                        /articles/
                      </span>
                      <input
                        required
                        maxLength={180}
                        value={form.slug}
                        onChange={(event) =>
                          updateForm("slug", slugify(event.target.value))
                        }
                        placeholder="understanding-healthy-sleep"
                        className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none"
                      />
                    </div>
                    <span className="mt-1.5 block text-xs leading-5 text-[#718176]">
                      Used in the article URL. Use lowercase words separated
                      by hyphens.
                    </span>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-bold">
                      Category *
                    </span>
                    <select
                      value={form.categorySlug}
                      onChange={(event) =>
                        updateForm("categorySlug", event.target.value)
                      }
                      className="min-h-12 w-full rounded-xl border border-[#cbd9ce] bg-white px-3 text-sm outline-none focus:border-[#218548] focus:ring-4 focus:ring-[#218548]/10"
                    >
                      {topics.map((topic) => (
                        <option key={topic.slug} value={topic.slug}>
                          {topic.title}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-bold">
                      Reading time
                    </span>
                    <input
                      value={form.readTime}
                      onChange={(event) =>
                        updateForm("readTime", event.target.value)
                      }
                      placeholder="5 min read"
                      className="min-h-12 w-full rounded-xl border border-[#cbd9ce] bg-white px-3 text-sm outline-none focus:border-[#218548] focus:ring-4 focus:ring-[#218548]/10"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-bold">
                      Article summary *
                    </span>
                    <textarea
                      required
                      rows={3}
                      maxLength={400}
                      value={form.excerpt}
                      onChange={(event) =>
                        updateForm("excerpt", event.target.value)
                      }
                      placeholder="Write a short summary for article cards and search results."
                      className="w-full rounded-xl border border-[#cbd9ce] bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-[#218548] focus:ring-4 focus:ring-[#218548]/10"
                    />
                    <span className="mt-1 block text-right text-xs text-[#718176]">
                      {form.excerpt.length}/400
                    </span>
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-bold">
                      Introduction *
                    </span>
                    <textarea
                      required
                      rows={4}
                      value={form.introduction}
                      onChange={(event) =>
                        updateForm("introduction", event.target.value)
                      }
                      placeholder="Introduce the subject and explain what readers will learn."
                      className="w-full rounded-xl border border-[#cbd9ce] bg-white px-4 py-3 text-sm leading-7 outline-none focus:border-[#218548] focus:ring-4 focus:ring-[#218548]/10"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-bold">
                      Article content *
                    </span>
                    <p className="mb-3 text-xs leading-6 text-[#718176]">
                      Use headings that begin with <code>## </code>, leave
                      a blank line between paragraphs, and start bullet
                      points with <code>- </code>. Example:{" "}
                      <code>## Prevention</code>
                    </p>
                    <textarea
                      required
                      rows={16}
                      value={form.body}
                      onChange={(event) =>
                        updateForm("body", event.target.value)
                      }
                      placeholder={"## Introduction\n\nWrite your content here.\n\n## Key points\n\n- First point\n- Second point"}
                      className="w-full rounded-xl border border-[#cbd9ce] bg-white px-4 py-3 font-mono text-sm leading-7 outline-none focus:border-[#218548] focus:ring-4 focus:ring-[#218548]/10"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-bold">
                      Article status
                    </span>
                    <select
                      value={form.status}
                      onChange={(event) =>
                        updateForm(
                          "status",
                          event.target.value as ArticleStatus
                        )
                      }
                      className="min-h-12 w-full rounded-xl border border-[#cbd9ce] bg-white px-3 text-sm outline-none focus:border-[#218548] focus:ring-4 focus:ring-[#218548]/10 sm:max-w-xs"
                    >
                      <option value="Draft">Save as draft</option>
                      <option value="Published">Mark as published</option>
                    </select>
                    <span className="mt-2 block text-xs leading-5 text-[#718176]">
                      Publishing here changes the prototype status. It does
                      not publish the article to the public website yet.
                    </span>
                  </label>
                </div>

                {notice && (
                  <p
                    role="alert"
                    className="rounded-xl border border-[#e7c1a7] bg-[#fff3e9] p-3 text-sm leading-6 text-[#81441e]"
                  >
                    {notice}
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#dce7de] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <button
                  type="button"
                  onClick={openFormPreview}
                  className={buttonSecondary}
                >
                  Preview article
                </button>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setEditorOpen(false);
                      setNotice("");
                    }}
                    className={buttonSecondary}
                  >
                    Cancel
                  </button>

                  <button type="submit" className={buttonPrimary}>
                    {editingId ? "Save changes" : "Save article"}
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      )}

      {previewArticle && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-[#10251b]/60 p-3 backdrop-blur-sm sm:p-6"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPreviewArticle(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-preview-title"
            className="mx-auto my-3 max-w-3xl overflow-hidden rounded-2xl border border-[#dce7de] bg-[#f8faf7] shadow-2xl sm:my-8"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[#dce7de] bg-white px-5 py-4 sm:px-7">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#218548]">
                  Article preview
                </p>
                <p className="mt-1 text-xs text-[#718176]">
                  Unsaved changes are shown here.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                className={buttonSecondary}
              >
                Close preview
              </button>
            </div>

            <article className="px-5 py-7 sm:px-10 sm:py-10">
              <span className="inline-flex rounded-full border border-[#c9dfcd] bg-[#e4f1e6] px-3 py-1.5 text-sm font-semibold text-[#17633d]">
                {previewArticle.category}
              </span>

              <h2
                id="article-preview-title"
                className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
              >
                {previewArticle.title || "Untitled article"}
              </h2>

              <p className="mt-4 text-lg leading-8 text-[#53645b]">
                {previewArticle.excerpt || "Article summary"}
              </p>

              <div className="mt-4 text-xs text-[#718176]">
                {previewArticle.readTime}
              </div>

              <div className="mt-7 rounded-2xl border border-[#dce7de] bg-white p-5 sm:p-6">
                <p className="text-base leading-8 text-[#40554a]">
                  {previewArticle.introduction}
                </p>
              </div>

              <div className="mt-9 space-y-8">
                {previewArticle.sections.map((section) => (
                  <section key={section.heading}>
                    <h3 className="text-xl font-extrabold sm:text-2xl">
                      {section.heading}
                    </h3>

                    <div className="mt-3 space-y-4">
                      {section.paragraphs.map((paragraph, index) => (
                        <p
                          key={`${section.heading}-${index}`}
                          className="text-base leading-8 text-[#40554a]"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {section.bullets && (
                      <ul className="mt-4 space-y-3">
                        {section.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex items-start gap-3 text-sm leading-7 text-[#40554a] sm:text-base"
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

              <aside className="mt-10 rounded-2xl border border-[#c9dfcd] bg-[#edf6ee] p-5">
                <h3 className="font-extrabold">
                  Health information disclaimer
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#40554a]">
                  This article is for general educational purposes and is
                  not a substitute for professional medical assessment,
                  diagnosis, or treatment.
                </p>
              </aside>
            </article>
          </section>
        </div>
      )}
    </div>
  );
}
