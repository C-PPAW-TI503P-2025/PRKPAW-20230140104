const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

exports.updatePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut, nama } = req.body;
    if (checkIn === undefined && checkOut === undefined && nama === undefined) {
      return res.status(400).json({
        message: "Request body tidak berisi data yang valid untuk diupdate (checkIn, checkOut, atau nama).",
      });
    }
    const recordToUpdate = await Presensi.findByPk(presensiId);
    if (!recordToUpdate) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
    recordToUpdate.nama = nama || recordToUpdate.nama;
    await recordToUpdate.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const presensiId = req.params.id;
    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }
    if (recordToDelete.userId !== userId) {
      return res.status(403).json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
    }
    await recordToDelete.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    // Cek apakah masih ada presensi tanpa checkout
    const existing = await Presensi.findOne({
      where: {
        userId,
        checkOut: null
      },
      order: [["checkIn", "DESC"]]
    });

    if (existing) {
      return res.status(400).json({
        message: "Anda masih memiliki presensi yang belum check-out"
      });
    }

    const newRecord = await Presensi.create({
      userId,
      checkIn: new Date(),
      latitude,
      longitude
    });

    return res.status(200).json({
      message: "Check-in berhasil",
      presensi: newRecord
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};





exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;

    const presensi = await Presensi.findOne({
      where: {
        userId,
        checkOut: null,
      },
      order: [["checkIn", "DESC"]],
    });

    if (!presensi) {
      return res.status(400).json({ message: "Belum check in atau sudah check out" });
    }

    presensi.checkOut = new Date();
    await presensi.save();

    return res.status(200).json({ message: "Check out berhasil", presensi });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
