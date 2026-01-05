exports.testConnection = (req, res) => {
  const { message, deviceId } = req.body;
  console.log(`📡 [IOT] Pesan dari ${deviceId}: ${message}`);
  res.status(200).json({ status: "ok", reply: "Server menerima koneksi!" });
};

exports.receiveSensorData = (req, res) => {
  const { suhu, kelembaban, cahaya } = req.body;
  console.log(`🔥 [LOG] Suhu: ${suhu}°C | Lembab: ${kelembaban}% | Cahaya: ${cahaya}`);
  res.status(200).json({ status: "diterima" });
};
