/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Eye, FileText, Video } from 'lucide-react';
import { contentService } from '@/features/content/content.service';
import { Content, ArticleContent, VideoContent } from '@/features/content/content.types';
import { ContentFormModal } from './ContentFormModal';
import { ContentViewModal } from './ContentViewModal';

export default function ContentManagement() {
  const [allContents, setAllContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [activeTab, setActiveTab] = useState<'articles' | 'videos'>('articles');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | undefined>(undefined);

  // View Modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingContent, setViewingContent] = useState<Content | null>(null);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    setIsLoading(true);
    try {
      const data = await contentService.getContents();
      setAllContents(data);
    } catch (error) {
      console.error("Failed to fetch contents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingContent(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (content: Content) => {
    setEditingContent(content);
    setIsModalOpen(true);
  };

  const handleView = (content: Content) => {
    setViewingContent(content);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus konten ini?")) {
      try {
        await contentService.deleteContent(id);
        await fetchContents(); // Refresh list
      } catch (error) {
        console.error("Failed to delete content:", error);
        alert("Gagal menghapus konten");
      }
    }
  };

  const filteredContents = useMemo(() => {
    return allContents.filter(content => {
      // Filter by type (Tab)
      const typeMatch = activeTab === 'articles' ? content.type === 'article' : content.type === 'video';
      if (!typeMatch) return false;

      // Filter by category
      if (selectedType !== 'all' && content.category !== selectedType) return false;

      // Filter by status
      if (selectedStatus !== 'all' && content.status !== selectedStatus) return false;

      // Filter by search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = content.title.toLowerCase().includes(query);
        const categoryMatch = content.category.toLowerCase().includes(query);
        const articleFieldsMatch = content.type === 'article'
          ? (
              ((content as ArticleContent).excerpt || '').toLowerCase().includes(query) ||
              ((content as ArticleContent).author || '').toLowerCase().includes(query) ||
              (((content as ArticleContent).content || '').toLowerCase().includes(query))
            )
          : false;
        const videoFieldsMatch = content.type === 'video'
          ? (
              (((content as VideoContent).duration || '').toLowerCase().includes(query)) ||
              (((content as VideoContent).videoUrl || '').toLowerCase().includes(query))
            )
          : false;

        return titleMatch || categoryMatch || articleFieldsMatch || videoFieldsMatch;
      }

      return true;
    });
  }, [allContents, activeTab, selectedType, selectedStatus, searchQuery]);

  const stats = useMemo(() => {
    return {
      totalArticles: allContents.filter(c => c.type === 'article').length,
      totalVideos: allContents.filter(c => c.type === 'video').length,
      totalViews: allContents.reduce((sum, c) => sum + (c.views || 0), 0),
      totalDrafts: allContents.filter(c => c.status === 'draft').length
    };
  }, [allContents]);

  const getStatusStyle = (status: string) => {
    return status === 'published'
      ? 'bg-green-100 text-green-700'
      : 'bg-yellow-100 text-yellow-700';
  };

  const getStatusLabel = (status: string) => {
    return status === 'published' ? 'Dipublikasi' : 'Draft';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Manajemen Konten Edukasi</h1>
        <p className="text-gray-600">Kelola artikel dan video edukasi untuk pengguna</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-gray-900">{stats.totalArticles}</p>
          </div>
          <p className="text-gray-600">Total Artikel</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-gray-900">{stats.totalVideos}</p>
          </div>
          <p className="text-gray-600">Total Video</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-gray-900">{stats.totalViews.toLocaleString()}</p>
          </div>
          <p className="text-gray-600">Total Views</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-gray-900">{stats.totalDrafts}</p>
          </div>
          <p className="text-gray-600">Draft</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-6 py-4 border-b-2 transition-colors ${activeTab === 'articles'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>Artikel</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-4 border-b-2 transition-colors ${activeTab === 'videos'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                <span>Video</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Cari ${activeTab === 'articles' ? 'artikel' : 'video'}...`}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">Semua Kategori</option>
              <option value="Pengenalan">Pengenalan</option>
              <option value="Pencegahan">Pencegahan</option>
              <option value="Skrining">Skrining</option>
              <option value="Pengobatan">Pengobatan</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Testimoni">Testimoni</option>
              <option value="Edukasi">Edukasi</option>
            </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'published' | 'draft')}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="all">Semua Status</option>
            <option value="published">Dipublikasi</option>
            <option value="draft">Draft</option>
          </select>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedType('all');
              setSelectedStatus('all');
            }}
            className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Tambah {activeTab === 'articles' ? 'Artikel' : 'Video'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : activeTab === 'articles' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredContents.map((content) => {
            const article = content as ArticleContent;
            return (
              <div key={article.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(article.status)}`}>
                      {getStatusLabel(article.status)}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
                      {article.category}
                    </span>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{article.views}</span>
                    </div>
                  </div>
                  <h3 className="text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-gray-500 mb-4">
                    <span>{article.author}</span>
                    <span>{formatDate(article.publishedDate)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(article)}
                      className="flex-1 px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Lihat
                    </button>
                    <button
                      onClick={() => handleEdit(article)}
                      className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredContents.map((content) => {
            const video = content as VideoContent;
            return (
              <div key={video.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-8 border-l-teal-600 border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(video.status)}`}>
                      {getStatusLabel(video.status)}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 px-2 py-1 rounded text-white text-sm">
                    {video.duration}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {video.category}
                    </span>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{video.views}</span>
                    </div>
                  </div>
                  <h3 className="text-gray-900 mb-4">{video.title}</h3>
                  <div className="flex items-center justify-between text-gray-500 mb-4">
                    <span>Diunggah: {formatDate(video.uploadedDate)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(video)}
                      className="flex-1 px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Lihat
                    </button>
                    <button
                      onClick={() => handleEdit(video)}
                      className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ContentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchContents}
        initialData={editingContent}
        type={activeTab === 'articles' ? 'article' : 'video'}
      />

      <ContentViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        content={viewingContent}
      />
    </div>
  );
}
