
import { articles } from "@/data/afya";
import type { Article } from "@/data/afya";

export type ArticleStatus = "Draft" | "Published";

export type AdminArticle = Article & {
  id: string;
  status: ArticleStatus;
  updatedAt: string;
};

const STORAGE_KEY = "afya-notes-admin-articles-v1";

function createInitialArticles(): AdminArticle[] {
  return articles.map((article) => ({
    ...article,
    sections: article.sections.map((section) => ({
      ...section,
      paragraphs: [...section.paragraphs],
      bullets: section.bullets ? [...section.bullets] : undefined,
    })),
    id: article.slug,
    status: "Published",
    updatedAt: article.publishedAt,
  }));
}

export function loadAdminArticles(): AdminArticle[] {
  if (typeof window === "undefined") {
    return createInitialArticles();
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return createInitialArticles();
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return createInitialArticles();
    }

    return parsed as AdminArticle[];
  } catch {
    return createInitialArticles();
  }
}

export function saveAdminArticles(
  records: AdminArticle[]
): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(records)
    );

    return true;
  } catch {
    return false;
  }
}

export function createArticleRecord(
  article: Article,
  status: ArticleStatus
): AdminArticle {
  return {
    ...article,
    id: `article-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    sections: article.sections.map((section) => ({
      ...section,
      paragraphs: [...section.paragraphs],
      bullets: section.bullets ? [...section.bullets] : undefined,
    })),
    status,
    updatedAt: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  };
}
