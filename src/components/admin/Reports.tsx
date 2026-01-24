import { Download, Calendar, TrendingUp, Users, FileText } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Reports() {
  const monthlyScreenings = [
    { month: 'Jan', total: 120, positive: 15, negative: 105 },
    { month: 'Feb', total: 135, positive: 18, negative: 117 },
    { month: 'Mar', total: 148, positive: 12, negative: 136 },
    { month: 'Apr', total: 142, positive: 20, negative: 122 },
    { month: 'Mei', total: 160, positive: 17, negative: 143 },
    { month: 'Jun', total: 156, positive: 23, negative: 133 },
  ];

  const ageDistribution = [
    { range: '20-25', count: 180 },
    { range: '26-30', count: 320 },
    { range: '31-35', count: 285 },
    { range: '36-40', count: 210 },
    { range: '41-45', count: 145 },
    { range: '46-50', count: 94 },
  ];

  const riskLevels = [
    { name: 'Rendah', value: 780, color: '#10b981' },
    { name: 'Sedang', value: 431, color: '#f59e0b' },
    { name: 'Tinggi', value: 23, color: '#ef4444' },
  ];

  const regionData = [
    { region: 'Jakarta Pusat', screenings: 245, highRisk: 8 },
    { region: 'Jakarta Selatan', screenings: 198, highRisk: 5 },
    { region: 'Jakarta Timur', screenings: 167, highRisk: 4 },
    { region: 'Jakarta Barat', screenings: 153, highRisk: 3 },
    { region: 'Jakarta Utara', screenings: 121, highRisk: 3 },
  ];

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Laporan & Analitik</h1>
        <p className="text-gray-600">Analisis data dan statistik sistem EWS CaServ</p>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div className="flex gap-3">
              <div>
                <label className="block text-gray-600 mb-1">Dari Tanggal</label>
                <input
                  type="date"
                  defaultValue="2024-01-01"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Sampai Tanggal</label>
                <input
                  type="date"
                  defaultValue="2024-11-28"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
          <button className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Laporan
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-gray-600 mb-1">Total Pengguna</p>
          <p className="text-gray-900 mb-1">1,234</p>
          <p className="text-green-600">+12% dari bulan lalu</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-teal-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-gray-600 mb-1">Total Skrining</p>
          <p className="text-gray-900 mb-1">861</p>
          <p className="text-green-600">+8% dari bulan lalu</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-gray-600 mb-1">Kasus Risiko Tinggi</p>
          <p className="text-gray-900 mb-1">23</p>
          <p className="text-red-600">+3 dari bulan lalu</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-gray-600 mb-1">Tingkat Deteksi</p>
          <p className="text-gray-900 mb-1">2.67%</p>
          <p className="text-gray-600">dari total skrining</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Screenings Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-900 mb-6">Tren Skrining Bulanan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyScreenings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#14b8a6" strokeWidth={2} name="Total" />
              <Line type="monotone" dataKey="positive" stroke="#ef4444" strokeWidth={2} name="Positif" />
              <Line type="monotone" dataKey="negative" stroke="#10b981" strokeWidth={2} name="Negatif" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-900 mb-6">Distribusi Tingkat Risiko</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskLevels}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {riskLevels.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Age Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-900 mb-6">Distribusi Usia Pengguna</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#14b8a6" name="Jumlah Pengguna" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Regional Data */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-900 mb-6">Data per Wilayah</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="screenings" fill="#14b8a6" name="Skrining" />
              <Bar dataKey="highRisk" fill="#ef4444" name="Risiko Tinggi" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Statistics Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-900">Statistik Detail per Bulan</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Bulan</th>
                <th className="px-6 py-3 text-left text-gray-700">Total Skrining</th>
                <th className="px-6 py-3 text-left text-gray-700">Hasil Positif</th>
                <th className="px-6 py-3 text-left text-gray-700">Hasil Negatif</th>
                <th className="px-6 py-3 text-left text-gray-700">Tingkat Deteksi</th>
                <th className="px-6 py-3 text-left text-gray-700">Pertumbuhan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {monthlyScreenings.map((data, index) => {
                const detectionRate = ((data.positive / data.total) * 100).toFixed(2);
                const growth = index > 0 
                  ? (((data.total - monthlyScreenings[index - 1].total) / monthlyScreenings[index - 1].total) * 100).toFixed(1)
                  : '0';
                return (
                  <tr key={data.month} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{data.month}</td>
                    <td className="px-6 py-4 text-gray-600">{data.total}</td>
                    <td className="px-6 py-4 text-red-600">{data.positive}</td>
                    <td className="px-6 py-4 text-green-600">{data.negative}</td>
                    <td className="px-6 py-4 text-gray-600">{detectionRate}%</td>
                    <td className="px-6 py-4">
                      <span className={`${parseFloat(growth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {parseFloat(growth) >= 0 ? '+' : ''}{growth}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
