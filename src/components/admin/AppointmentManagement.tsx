import { useState } from 'react';
import { Calendar, Search, Filter, Plus, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function AppointmentManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('2024-11-28');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const appointments = [
    {
      id: 1,
      patientName: 'Sarah Johnson',
      patientPhone: '+62 812-3456-7890',
      date: '28 Nov 2024',
      time: '09:00',
      location: 'Ruang Pemeriksaan A',
      type: 'IVA Test',
      status: 'confirmed',
      notes: 'Pasien pertama kali',
    },
    {
      id: 2,
      patientName: 'Maria Garcia',
      patientPhone: '+62 813-4567-8901',
      date: '28 Nov 2024',
      time: '10:30',
      location: 'Ruang Pemeriksaan B',
      type: 'Follow-up',
      status: 'confirmed',
      notes: 'Pemeriksaan lanjutan',
    },
    {
      id: 3,
      patientName: 'Lisa Anderson',
      patientPhone: '+62 814-5678-9012',
      date: '28 Nov 2024',
      time: '13:00',
      location: 'Ruang Pemeriksaan A',
      type: 'IVA Test',
      status: 'pending',
      notes: 'Menunggu konfirmasi',
    },
    {
      id: 4,
      patientName: 'Anna Martinez',
      patientPhone: '+62 815-6789-0123',
      date: '29 Nov 2024',
      time: '14:00',
      location: 'Ruang Pemeriksaan C',
      type: 'Consultation',
      status: 'scheduled',
      notes: 'Konsultasi hasil',
    },
    {
      id: 5,
      patientName: 'Emily Davis',
      patientPhone: '+62 816-7890-1234',
      date: '29 Nov 2024',
      time: '15:30',
      location: 'Ruang Pemeriksaan B',
      type: 'IVA Test',
      status: 'cancelled',
      notes: 'Dibatalkan oleh pasien',
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Dikonfirmasi';
      case 'scheduled':
        return 'Terjadwal';
      case 'pending':
        return 'Menunggu';
      case 'cancelled':
        return 'Dibatalkan';
      case 'completed':
        return 'Selesai';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Manajemen Jadwal Skrining</h1>
        <p className="text-gray-600">Kelola jadwal pemeriksaan dan appointment pasien</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-gray-900">45</p>
          </div>
          <p className="text-gray-600">Hari Ini</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-gray-900">32</p>
          </div>
          <p className="text-gray-600">Dikonfirmasi</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-gray-900">8</p>
          </div>
          <p className="text-gray-600">Menunggu</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-gray-900">5</p>
          </div>
          <p className="text-gray-600">Dibatalkan</p>
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
                placeholder="Cari nama pasien atau nomor telepon..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="confirmed">Dikonfirmasi</option>
              <option value="pending">Menunggu</option>
              <option value="scheduled">Terjadwal</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
            <button className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Tambah Jadwal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Side - Patient Info */}
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-700">{appointment.patientName.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{appointment.patientName}</h3>
                    <p className="text-gray-600 mb-2">{appointment.patientPhone}</p>
                    <div className="flex flex-wrap gap-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Status and Actions */}
              <div className="flex flex-col lg:items-end gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {appointment.type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusStyle(appointment.status)}`}>
                    {getStatusIcon(appointment.status)}
                    {getStatusLabel(appointment.status)}
                  </span>
                </div>
                <div className="flex gap-2">
                  {appointment.status === 'pending' && (
                    <>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Konfirmasi
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Tolak
                      </button>
                    </>
                  )}
                  {appointment.status !== 'cancelled' && (
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Edit
                    </button>
                  )}
                  <button className="px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors">
                    Detail
                  </button>
                </div>
              </div>
            </div>
            {appointment.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-600">
                  <span className="font-medium">Catatan:</span> {appointment.notes}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-gray-600">Menampilkan 1-5 dari 89 jadwal</p>
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
  );
}
