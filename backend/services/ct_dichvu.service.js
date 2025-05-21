const { Ct_DichVu, DichVu, PhieuDatTiec } = require("../models");
const ApiError = require("../utils/apiError.js");

const Ct_DichVuService = {
  getAllCt_DichVu: async (limit, offset) => {
    try {
      return await Ct_DichVu.findAll({
        limit,
        offset,
        include: [
          { model: DichVu, attributes: ["MaDichVu", "TenDichVu", "DonGia"] },
          {
            model: PhieuDatTiec,
            attributes: ["SoPhieuDatTiec", "NgayDatTiec"],
          },
        ],
      });
    } catch (err) {
      throw new ApiError(500, "Không thể lấy danh sách chi tiết dịch vụ.");
    }
  },

  getCt_DichVuById: async (maDichVu, soPhieuDatTiec) => {
    try {
      const ctDichVu = await Ct_DichVu.findOne({
        where: { MaDichVu: maDichVu, SoPhieuDatTiec: soPhieuDatTiec },
        include: [
          { model: DichVu, attributes: ["MaDichVu", "TenDichVu", "DonGia"] },
          {
            model: PhieuDatTiec,
            attributes: ["SoPhieuDatTiec", "NgayDatTiec"],
          },
        ],
      });
      if (!ctDichVu)
        throw new ApiError(404, "Không tìm thấy chi tiết dịch vụ.");
      return ctDichVu;
    } catch (err) {
      throw err.statusCode
        ? err
        : new ApiError(500, "Lỗi khi lấy thông tin chi tiết dịch vụ.");
    }
  },

  createCt_DichVu: async (data) => {
    try {
      const { MaDichVu, SoPhieuDatTiec, SoLuong } = data;

			console.log("Received data:", data);

      if (!MaDichVu || !SoPhieuDatTiec || !SoLuong) {
        throw new ApiError(
          400,
          "Thiếu thông tin bắt buộc (MaDichVu, SoPhieuDatTiec, SoLuong)."
        );
      }

      if (SoLuong <= 0) {
        throw new ApiError(400, "Số lượng phải lớn hơn 0.");
      }

      const dichVu = await DichVu.findOne({
        where: { MaDichVu, TinhTrang: "Đang áp dụng" },
      });

			console.log("Dịch vụ tìm được:", dichVu); // <- Xem có null không
      if (!dichVu) {
        throw new ApiError(
          404,
          "Dịch vụ không tồn tại hoặc không đang áp dụng."
        );
      }

      const phieuDatTiec = await PhieuDatTiec.findByPk(SoPhieuDatTiec);
      if (!phieuDatTiec) {
        throw new ApiError(404, "Phiếu đặt tiệc không tồn tại.");
      }

      const existed = await Ct_DichVu.findOne({
        where: { MaDichVu, SoPhieuDatTiec },
      });
      if (existed) {
        throw new ApiError(400, "Dịch vụ này đã được thêm vào phiếu đặt tiệc.");
      }

      const DonGia = dichVu.DonGia * SoLuong;

      return await Ct_DichVu.create({
        MaDichVu,
        SoPhieuDatTiec,
        SoLuong,
        DonGia,
      });
    } catch (err) {
      throw err.statusCode
        ? err
        : new ApiError(500, "Lỗi khi tạo chi tiết dịch vụ.");
    }
  },

  updateCt_DichVu: async (maDichVu, soPhieuDatTiec, data) => {
    try {
      const { SoLuong } = data;

      if (!SoLuong) {
        throw new ApiError(400, "Không có số lượng để cập nhật.");
      }

      if (SoLuong <= 0) {
        throw new ApiError(400, "Số lượng phải lớn hơn 0.");
      }

      const ctDichVu = await Ct_DichVu.findOne({
        where: { MaDichVu: maDichVu, SoPhieuDatTiec: soPhieuDatTiec },
        include: [{ model: DichVu }],
      });
      if (!ctDichVu) {
        throw new ApiError(404, "Không tìm thấy chi tiết dịch vụ để cập nhật.");
      }

      const dichVu = ctDichVu.DichVu;
      const DonGia = dichVu.DonGia * SoLuong;

      const [affectedRows] = await Ct_DichVu.update(
        { SoLuong, DonGia },
        { where: { MaDichVu: maDichVu, SoPhieuDatTiec: soPhieuDatTiec } }
      );
      if (affectedRows === 0) {
        throw new ApiError(404, "Cập nhật chi tiết dịch vụ thất bại.");
      }
      return affectedRows;
    } catch (err) {
      throw err.statusCode
        ? err
        : new ApiError(500, "Cập nhật chi tiết dịch vụ thất bại.");
    }
  },
};

module.exports = Ct_DichVuService;
