const presensiRecords = require("../data/presensiData");
const { Presensi, User } = require("../models");
const { Op } = require("sequelize");
const { startOfDay, endOfDay } = require("date-fns");
const tz = require("date-fns-tz");




exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;

    const options = {
      where: {},
      include: [
        {
          model: User,
          as: "user", // ← WAJIB SESUAI ALIAS MODEL
          attributes: ["nama"],
        },
      ],
    };

    // Filter nama user
    if (nama) {
      options.include[0].where = {
        nama: { [Op.like]: `%${nama}%` },
      };
    }

    // Filter tanggal
    if (tanggalMulai && tanggalSelesai) {
      options.where.checkIn = {
        [Op.between]: [
          new Date(tanggalMulai + "T00:00:00"),
          new Date(tanggalSelesai + "T23:59:59"),
        ],
      };
    }

    const data = await Presensi.findAll(options);

    return res.json({ success: true, data });
  } catch (err) {
    console.error("ERROR GET DAILY REPORT:", err);
    return res.status(500).json({ message: err.message });
  }
};

exports.getDailyReportByDate = async (req, res) => {
  try {
    const { tanggal } = req.query;
    const timeZone = "Asia/Jakarta";
        let options = {
      where: {},
      include: [
        {
          model: User,
          attributes: ["nama"]
        }
      ]
    };

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


