import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    setUser(payload);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

        {user && (
          <div className="mb-6">
            <p className="text-lg font-medium">Selamat datang, {user.nama} 👋</p>
            <p className="text-gray-600">Role: {user.role}</p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
