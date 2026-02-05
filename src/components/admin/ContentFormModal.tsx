"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Content, ContentType, ContentStatus, ArticleContent, VideoContent } from "@/features/content/content.types";
import { contentService } from "@/features/content/content.service";
import { Loader2 } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

interface ContentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Content;
  type: ContentType;
}

export function ContentFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  type
}: ContentFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Content>>({
    title: initialData?.title || "",
    category: initialData?.category || "Pengenalan",
    status: initialData?.status || "draft",
    thumbnail: initialData?.thumbnail || "",
    type: type
  });

  useEffect(() => {
    if (!isOpen) return;
    setFormData({
      title: initialData?.title || "",
      category: initialData?.category || "Pengenalan",
      status: (initialData?.status as ContentStatus) || "draft",
      thumbnail: initialData?.thumbnail || "",
      type,
      ...(type === "article"
        ? {
            author: (initialData as ArticleContent | undefined)?.author || "",
            excerpt: (initialData as ArticleContent | undefined)?.excerpt || "",
            content: (initialData as ArticleContent | undefined)?.content || "",
          }
        : {
            duration: (initialData as VideoContent | undefined)?.duration || "",
            videoUrl: (initialData as VideoContent | undefined)?.videoUrl || "",
          })
    });
  }, [initialData, type, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Helper to remove undefined values
      const cleanData = (data: any) => {
        const cleaned: any = {};
        Object.keys(data).forEach(key => {
          if (data[key] !== undefined) {
            cleaned[key] = data[key];
          }
        });
        return cleaned;
      };

      if (initialData?.id) {
        await contentService.updateContent(initialData.id, cleanData(formData));
      } else {
        // Prepare default values for new content
        const newContent: any = {
          ...formData,
          views: 0,
          type
        };

        if (type === 'article') {
          newContent.author = (formData as any).author || 'Admin';
          newContent.publishedDate = new Date().toISOString();
          newContent.excerpt = (formData as any).excerpt || '';
        } else {
          newContent.duration = (formData as any).duration || '0:00';
          newContent.uploadedDate = new Date().toISOString();
        }

        await contentService.createContent(cleanData(newContent));
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Failed to save content:", error);
      alert(`Gagal menyimpan konten: ${error.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-150 bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit" : "Tambah"} {type === 'article' ? "Artikel" : "Video"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Judul</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Masukkan judul konten"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Kategori</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Pengenalan">Pengenalan</option>
                <option value="Pencegahan">Pencegahan</option>
                <option value="Skrining">Skrining</option>
                <option value="Pengobatan">Pengobatan</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Testimoni">Testimoni</option>
                <option value="Edukasi">Edukasi</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentStatus })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Thumbnail URL</label>
            <input
              required
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="https://..."
            />
            {formData.thumbnail && (
              <div className="mt-2 aspect-video bg-gray-100 border rounded-md overflow-hidden">
                <ImageWithFallback
                  src={formData.thumbnail}
                  alt="Preview Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {type === 'article' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Penulis</label>
                <input
                  required
                  type="text"
                  value={(formData as ArticleContent).author || ''}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value } as any)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Nama penulis"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ringkasan (Excerpt)</label>
                <textarea
                  required
                  value={(formData as ArticleContent).excerpt || ''}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value } as any)}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="Ringkasan singkat artikel..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Konten</label>
                <textarea
                  value={(formData as ArticleContent).content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value } as any)}
                  className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                  rows={6}
                  placeholder="Isi konten artikel..."
                />
              </div>
            </>
          )}

          {type === 'video' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Durasi</label>
                <input
                  required
                  type="text"
                  value={(formData as VideoContent).duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value } as any)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g. 5:30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Video URL</label>
                <input
                  type="url"
                  value={(formData as VideoContent).videoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value } as any)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Link video (Youtube/etc)"
                />
              </div>
            </>
          )}

          <DialogFooter>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {initialData ? "Simpan Perubahan" : "Tambah Konten"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
