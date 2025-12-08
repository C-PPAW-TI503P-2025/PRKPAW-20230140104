import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // Modal foto
  const navigate = useNavigate();

  const fetchReports = async (queryName = '') => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: {},
      };

      if (queryName) config.params.nama = queryName;
      if (tanggalMulai) config.params.tanggalMulai = tanggalMulai;
      if (tanggalSelesai) config.params.tanggalSelesai = tanggalSelesai;

      setError(null);

      const res = await axios.get('http://localhost:3001/api/reports/daily', config);
      setReports(res.data.data || []);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Gagal mengambil laporan");
    }
  };

  useEffect(() => {
    fetchReports('');
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Laporan Presensi Harian</h1>

      {/* Pencarian */}
      <form onSubmit={handleSearchSubmit} className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded">
          Cari
        </button>
      </form>

      {/* Filter tanggal */}
      <form onSubmit={handleFilterSubmit} className="mb-6 flex items-center space-x-2">
        <label className="text-sm">Dari:</label>
        <input type="date" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} className="px-2 py-1 border rounded" />
        <label className="text-sm">Sampai:</label>
        <input type="date" value={tanggalSelesai} onChange={(e) => setTanggalSelesai(e.target.value)} className="px-2 py-1 border rounded" />
        <button type="submit" className="py-2 px-4 bg-green-600 text-white rounded">Terapkan</button>
      </form>

      {error && <p className="text-red-600 bg-red-100 p-4 rounded mb-4">{error}</p>}

      {/* TABEL */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-Out</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bukti Foto</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {reports.length > 0 ? (
              reports.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 text-sm">{p.user?.nama || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(p.checkIn).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {p.checkOut ? new Date(p.checkOut).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) : 'Belum Check-Out'}
                  </td>

                  {/* Thumbnail foto */}
                  <td className="px-6 py-4 text-sm">
                    {p.buktiFoto ? (
                      <img
                        src={`http://localhost:3001/uploads/${p.buktiFoto}`}
                        alt="bukti"
                        className="w-16 h-16 object-cover rounded cursor-pointer hover:scale-110 transition"
                        onClick={() => setSelectedImage(`http://localhost:3001/uploads/${p.buktiFoto}`)}
                      />
                    ) : (
                      <span className="text-gray-400">Tidak ada foto</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FOTO */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} className="max-w-[90%] max-h-[90%] rounded shadow-xl" />
        </div>
      )}
    </div>
  );
}

export default ReportPage;
