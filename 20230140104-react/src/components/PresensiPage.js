import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Webcam from "react-webcam";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { jwtDecode } from "jwt-decode";

// Fix Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function getToken() {
  return localStorage.getItem("token");
}

function PresensiPage() {
  const navigate = useNavigate();

  // State dasar presensi
  const [coords, setCoords] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");

  // State kamera
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  // Screenshot kamera
  const capture = () => {
    const imgSrc = webcamRef.current.getScreenshot();
    setImage(imgSrc);
  };

  // Cek token
  useEffect(() => {
    const token = getToken();
    if (!token) return navigate("/login");

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp && decoded.exp < now) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  // Ambil lokasi GPS
  const getLocation = () => {
    setError("");

    if (!navigator.geolocation) {
      return setError("Browser tidak mendukung GPS.");
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setError("Gagal mendapat lokasi: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  // Koordinat manual
  const applyManualCoords = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isFinite(lat) && isFinite(lng)) {
      setCoords({ lat, lng });
      setError("");
      setMessage("Koordinat manual digunakan.");
    } else {
      setError("Masukkan koordinat yang valid.");
    }
  };

  // Axios config
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  };

  // 🔵 CHECK-IN
  const handleCheckIn = async () => {
    setMessage("");
    setError("");

    if (!coords) return setError("Lokasi tidak ditemukan!");
    if (!image) return setError("Ambil foto terlebih dahulu!");

    try {
      const blob = await (await fetch(image)).blob();

      const formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("image", blob, "selfie.jpg");

      const response = await axios.post(
        "http://localhost:3001/api/presensi/checkin",
        formData,
        axiosConfig
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Check-in gagal.");
    }
  };

  // 🔴 CHECK-OUT
  const handleCheckOut = async () => {
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3001/api/presensi/checkout",
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Check-out gagal.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">

      {/* MAP */}
      {coords && (
        <div className="my-4 border rounded-lg overflow-hidden w-full max-w-md shadow">
          <MapContainer
            center={[coords.lat, coords.lng]}
            zoom={15}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[coords.lat, coords.lng]}>
              <Popup>Lokasi Anda</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {/* CARD */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-6">Presensi Kehadiran</h2>

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Tampilkan koordinat */}
        {coords && (
          <p className="text-sm text-gray-600 mb-4">
            Lokasi: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
          </p>
        )}

        <button onClick={getLocation} className="text-blue-600 underline mb-4 text-sm">
          Ambil lokasi ulang
        </button>

        {/* Koordinat manual */}
        {!coords && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Gunakan koordinat manual:</p>
            <div className="flex gap-2">
              <input
                placeholder="Latitude"
                className="w-1/2 px-2 py-1 border rounded"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
              />
              <input
                placeholder="Longitude"
                className="w-1/2 px-2 py-1 border rounded"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
              />
            </div>
            <button
              onClick={applyManualCoords}
              className="mt-2 bg-gray-200 px-3 py-1 rounded text-sm"
            >
              Gunakan Koordinat Manual
            </button>
          </div>
        )}

        {/* KAMERA */}
        <div className="my-4 border rounded overflow-hidden bg-black">
          {!image ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full"
              videoConstraints={{ facingMode: "user" }}
            />
          ) : (
            <img src={image} alt="Selfie" className="w-full" />
          )}
        </div>

        {/* Tombol Kamera */}
        {!image ? (
          <button
            onClick={capture}
            className="w-full bg-blue-500 text-white py-3 rounded mb-4"
          >
            Ambil Foto 📸
          </button>
        ) : (
          <button
            onClick={() => setImage(null)}
            className="w-full bg-gray-500 text-white py-3 rounded mb-4"
          >
            Ulangi Foto 🔄
          </button>
        )}

        {/* Tombol Presensi */}
        <div className="flex gap-4">
          <button
            onClick={handleCheckIn}
            className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Check-In
          </button>

          <button
            onClick={handleCheckOut}
            className="w-full py-3 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Check-Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default PresensiPage;
