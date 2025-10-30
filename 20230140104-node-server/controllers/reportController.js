const presensiRecords = require("../data/presensiData");
const { Presensi } = require("../models");
const { Op } = require("sequelize");
const { startOfDay, endOfDay } = require("date-fns");
const tz = require("date-fns-tz");




exports.getDailyReport = async (req, res) => {
  try {
    const { nama } = req.query;
    let options = { where: {} };

    if (nama) {
      options.where.nama = {
        [Op.like]: `%${nama}%`,
      };
    }

    const records = await Presensi.findAll(options);

    res.json({
      reportDate: new Date().toLocaleDateString(),
      data: records,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil laporan", error: error.message });
  }
};

exports.getDailyReportByDate = async (req, res) => {
  try {
    const { tanggal } = req.query;
    const timeZone = "Asia/Jakarta";
    let options = { where: {} };

    let targetDate;

    // ✅ Pastikan tanggal valid
    if (tanggal) {
      // Perbaikan: Parse tanggal dengan benar
      targetDate = new Date(tanggal + 'T00:00:00');
      if (isNaN(targetDate.getTime())) {
        return res.status(400).json({ message: "Format tanggal tidak valid. Gunakan format YYYY-MM-DD" });
      }
    } else {
      targetDate = new Date();
    }

    // ✅ Konversi ke timezone Jakarta
    const zonedDate = tz.toDate(targetDate, { timeZone });
    const awalHari = startOfDay(zonedDate);
    const akhirHari = endOfDay(zonedDate);

    // ✅ Query berdasarkan range waktu
    options.where.checkIn = {
      [Op.between]: [awalHari, akhirHari],
    };

    const records = await Presensi.findAll(options);

    res.json({
      reportDate: tanggal || new Date().toLocaleDateString("id-ID", { timeZone }),
      totalRecords: records.length,
      data: records,
    });
  } catch (error) {
    console.error("Error in getDailyReportByDate:", error);
    res.status(500).json({
      message: "Gagal mengambil laporan berdasarkan tanggal",
      error: error.message,
    });
  }
};


