import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";



function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser({
        name: decoded.name || decoded.nama || decoded.email || 'Pengguna'
      });
      setRole(decoded.role || 'user'); // ambil role dari payload token
    } catch (err) {
      console.error('Token invalid', err);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Login Sukses!
        </h1>

        <p className="text-lg text-gray-700 mb-6">
          Selamat datang, <span className="font-semibold">{user?.name}</span>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border rounded-md">
            <h3 className="font-semibold mb-2">Profil</h3>
            <p>Nama: {user?.name}</p>
            <p>Peran: {role}</p>
          </div>

          <div className="p-4 border rounded-md">
            <h3 className="font-semibold mb-2">Aksi</h3>
            {role === 'admin' ? (
              <button
                onClick={() => navigate('/report')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Lihat Report
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/checkin')}
                  className="px-4 py-2 bg-green-500 text-white rounded-md mr-2"
                >
                  Check-in
                </button>
                <button
                  onClick={() => navigate('/checkout')}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                >
                  Check-out
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-md font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
