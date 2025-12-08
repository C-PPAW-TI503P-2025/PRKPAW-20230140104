import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import ReportPage from './components/ReportPage';
import PresensiPage from './components/PresensiPage';

function App() {
  return (
    <Router>

      {/* Navbar GLOBAL */}
      <Navbar />

      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* User Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Admin */}
        <Route path="/report" element={<ReportPage />} />

        {/* Presensi */}
        <Route path="/checkin" element={<PresensiPage mode="checkin" />} />
        <Route path="/checkout" element={<PresensiPage mode="checkout" />} />

        {/* Default */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
