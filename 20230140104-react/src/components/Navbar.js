import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let userRole = null;

  if (token) {
    try {
      const user = jwtDecode(token);
      userRole = user.role;
    } catch (err) {
      console.error("TOKEN INVALID di navbar:", err);
      localStorage.removeItem("token");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ background: "#2463F2", color: "#fff", padding: "12px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        <div>
          <Link to="/dashboard" style={{ color: "#fff", marginRight: 16, textDecoration: "none" }}>
            Dashboard
          </Link>

          {token && (
            <Link to="/presensi" style={{ color: "#fff", marginRight: 16, textDecoration: "none" }}>
              Presensi
            </Link>
          )}

          {token && userRole === "admin" && (
            <Link to="/reports" style={{ color: "#fff", marginRight: 16, textDecoration: "none" }}>
              Laporan Admin
            </Link>
          )}
        </div>

        <div>
          {!token ? (
            <>
              <Link to="/login" style={{ color: "#fff", marginRight: 12, textDecoration: "none" }}>
                Login
              </Link>
              <Link to="/register" style={{ color: "#fff", textDecoration: "none" }}>
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;