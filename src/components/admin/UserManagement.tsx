import { useState } from 'react';
import { Search, Filter, UserPlus, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const users = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+62 812-3456-7890',
      registeredDate: '15 Nov 2024',
      riskLevel: 'low',
      lastCheckup: '20 Nov 2024',
      status: 'active',
    },
    {
      id: 2,
      name: 'Maria Garcia',
      email: 'maria.g@email.com',
      phone: '+62 813-4567-8901',
      registeredDate: '10 Nov 2024',
      riskLevel: 'medium',
      lastCheckup: '18 Nov 2024',
      status: 'active',
    },
    {
      id: 3,
      name: 'Lisa Anderson',
      email: 'lisa.a@email.com',
      phone: '+62 814-5678-9012',
      registeredDate: '8 Nov 2024',
      riskLevel: 'high',
      lastCheckup: '25 Nov 2024',
      status: 'active',
    },
    {
      id: 4,
      name: 'Anna Martinez',
      email: 'anna.m@email.com',
      phone: '+62 815-6789-0123',
      registeredDate: '5 Nov 2024',
      riskLevel: 'low',
      lastCheckup: '22 Nov 2024',
      status: 'active',
    },
    {
      id: 5,
      name: 'Emily Davis',
      email: 'emily.d@email.com',
      phone: '+62 816-7890-1234',
      registeredDate: '1 Nov 2024',
      riskLevel: 'medium',
      lastCheckup: '15 Nov 2024',
      status: 'inactive',
    },
  ];

  const getRiskLevelStyle = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRiskLevelLabel = (level: string) => {
    switch (level) {
      case 'high':
        return 'Tinggi';
      case 'medium':
        return 'Sedang';
      case 'low':
        return 'Rendah';
      default:
        return level;
    }
  };

  const getStatusStyle = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status: string) => {
    return status === 'active' ? 'Aktif' : 'Tidak Aktif';
  };

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Manajemen User</h1>
        <p className="text-gray-600">Kelola data pengguna aplikasi EWS CaServ</p>
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
                placeholder="Cari nama, email, atau nomor telepon..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-3">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">Semua User</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
              <option value="high-risk">Risiko Tinggi</option>
            </select>

            <button className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              <span className="hidden sm:inline">Tambah User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700">Nama</th>
                <th className="px-6 py-4 text-left text-gray-700">Kontak</th>
                <th className="px-6 py-4 text-left text-gray-700">Tgl. Registrasi</th>
                <th className="px-6 py-4 text-left text-gray-700">Tingkat Risiko</th>
                <th className="px-6 py-4 text-left text-gray-700">Pemeriksaan Terakhir</th>
                <th className="px-6 py-4 text-left text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">{user.name}</p>
                      <p className="text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{user.registeredDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getRiskLevelStyle(user.riskLevel)}`}>
                      {getRiskLevelLabel(user.riskLevel)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.lastCheckup}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(user.status)}`}>
                      {getStatusLabel(user.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Lihat Detail">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-gray-600">Menampilkan 1-5 dari 1,234 pengguna</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Sebelumnya
            </button>
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">3</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
