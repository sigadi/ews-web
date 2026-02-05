export type ContentType = 'article' | 'video';
export type ContentStatus = 'published' | 'draft';

export interface BaseContent {
  id: string;
  title: string;
  category: string;
  status: ContentStatus;
  views: number;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  type: ContentType;
}

export interface ArticleContent extends BaseContent {
  type: 'article';
  excerpt: string;
  author: string;
  publishedDate: string;
  content?: string; // HTML or Markdown content
}

export interface VideoContent extends BaseContent {
  type: 'video';
  duration: string;
  uploadedDate: string;
  videoUrl?: string;
}

export type Content = ArticleContent | VideoContent;

export interface ContentFilter {
  type?: ContentType;
  status?: ContentStatus;
  category?: string;
  search?: string;
}
