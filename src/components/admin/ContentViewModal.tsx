/* eslint-disable @next/next/no-img-element */
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Content, ArticleContent, VideoContent } from "@/features/content/content.types";
import { Eye, Calendar, User, Clock } from "lucide-react";

interface ContentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: Content | null;
}

export function ContentViewModal({
  isOpen,
  onClose,
  content
}: ContentViewModalProps) {
  if (!content) return null;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-200 bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Eye className="w-5 h-5 text-teal-600" />
            Detail {content.type === 'article' ? 'Artikel' : 'Video'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="space-y-4">
            <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden relative">
              <img
                src={content.thumbnail}
                alt={content.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  content.status === 'published' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {content.status === 'published' ? 'Dipublikasi' : 'Draft'}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                  {content.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{content.title}</h2>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 border-b pb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Dibuat: {formatDate(content.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{content.views} Views</span>
              </div>
              
              {content.type === 'article' && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{(content as ArticleContent).author}</span>
                </div>
              )}
              
              {content.type === 'video' && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{(content as VideoContent).duration}</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-4">
            {content.type === 'article' ? (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Ringkasan</h3>
                  <p className="text-gray-600">{(content as ArticleContent).excerpt}</p>
                </div>
                
                {(content as ArticleContent).content && (
                  <div className="prose max-w-none">
                    <h3 className="font-medium text-gray-900 mb-2">Konten Lengkap</h3>
                    <div className="text-gray-600 whitespace-pre-wrap">
                      {(content as ArticleContent).content}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                {(content as VideoContent).videoUrl && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Video URL</h3>
                    <a 
                      href={(content as VideoContent).videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:underline break-all"
                    >
                      {(content as VideoContent).videoUrl}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
