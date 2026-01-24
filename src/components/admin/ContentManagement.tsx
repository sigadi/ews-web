"use client";

import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, EyeOff, FileText, Video, Image as ImageIcon } from 'lucide-react';

export default function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [activeTab, setActiveTab] = useState<'articles' | 'videos'>('articles');

  const articles = [
    {
      id: 1,
      title: 'Apa itu Kanker Serviks?',
      excerpt: 'Kanker serviks adalah jenis kanker yang terjadi pada sel-sel serviks atau leher rahim...',
      category: 'Pengenalan',
      author: 'Dr. Sarah Johnson',
      publishedDate: '25 Nov 2024',
      status: 'published',
      views: 1234,
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
    },
    {
      id: 2,
      title: 'Pentingnya Deteksi Dini Kanker Serviks',
      excerpt: 'Deteksi dini merupakan kunci utama dalam pencegahan dan penanganan kanker serviks...',
      category: 'Pencegahan',
      author: 'Dr. Maria Garcia',
      publishedDate: '22 Nov 2024',
      status: 'published',
      views: 987,
      thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400',
    },
    {
      id: 3,
      title: 'Metode Skrining IVA',
      excerpt: 'IVA (Inspeksi Visual dengan Asam Asetat) adalah metode skrining yang sederhana...',
      category: 'Skrining',
      author: 'Dr. Lisa Anderson',
      publishedDate: '20 Nov 2024',
      status: 'draft',
      views: 0,
      thumbnail: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400',
    },
    {
      id: 4,
      title: 'Gaya Hidup Sehat Mencegah Kanker',
      excerpt: 'Pola hidup sehat dapat menurunkan risiko terkena berbagai jenis kanker termasuk kanker serviks...',
      category: 'Pencegahan',
      author: 'Dr. Anna Martinez',
      publishedDate: '18 Nov 2024',
      status: 'published',
      views: 756,
      thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
    },
  ];

  const videos = [
    {
      id: 1,
      title: 'Tutorial Pemeriksaan Mandiri',
      duration: '5:30',
      category: 'Tutorial',
      uploadedDate: '24 Nov 2024',
      status: 'published',
      views: 2341,
      thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400',
    },
    {
      id: 2,
      title: 'Testimoni Survivor Kanker Serviks',
      duration: '8:15',
      category: 'Testimoni',
      uploadedDate: '21 Nov 2024',
      status: 'published',
      views: 1876,
      thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
    },
    {
      id: 3,
      title: 'Proses Skrining IVA Step by Step',
      duration: '10:45',
      category: 'Edukasi',
      uploadedDate: '19 Nov 2024',
      status: 'draft',
      views: 0,
      thumbnail: 'https://images.unsplash.com/photo-1581093458791-9d42e68c3e4e?w=400',
    },
  ];

  const getStatusStyle = (status: string) => {
    return status === 'published'
      ? 'bg-green-100 text-green-700'
      : 'bg-yellow-100 text-yellow-700';
  };

  const getStatusLabel = (status: string) => {
    return status === 'published' ? 'Dipublikasi' : 'Draft';
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
            <p className="text-gray-900">42</p>
          </div>
          <p className="text-gray-600">Total Artikel</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-gray-900">18</p>
          </div>
          <p className="text-gray-600">Total Video</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-gray-900">45.2K</p>
          </div>
          <p className="text-gray-600">Total Views</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-gray-900">7</p>
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
              className={`px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'articles'
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
              className={`px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'videos'
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
              <option value="introduction">Pengenalan</option>
              <option value="prevention">Pencegahan</option>
              <option value="screening">Skrining</option>
              <option value="treatment">Pengobatan</option>
            </select>
            <button className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Tambah {activeTab === 'articles' ? 'Artikel' : 'Video'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {activeTab === 'articles' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {articles.map((article) => (
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
                  <span>{article.publishedDate}</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    Lihat
                  </button>
                  <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {videos.map((video) => (
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
                  <span>Diunggah: {video.uploadedDate}</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    Lihat
                  </button>
                  <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
