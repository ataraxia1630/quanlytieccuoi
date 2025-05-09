const { DichVu } = require("../models");
const { Op } = require("sequelize");
const { ApiError } = require("../utils/apiError");

const DichVuService = {
  getAllDichVu: async (limit, offset) => {
    try {
      return await DichVu.findAll({ limit, offset });
    } catch (error) {
      throw new ApiError("Không thể lấy danh sách dịch vụ.", 500);
    }
  },

  getDichVuById: async (id) => {
    try {
      const dichvu = await DichVu.findByPk(id);
      if (!dichvu) throw new ApiError("Không tìm thấy dịch vụ.", 404);
      return dichvu;
    } catch (err) {
      throw err.statusCode
        ? err
        : new ApiError("Lỗi khi lấy thông tin dịch vụ theo ID.", 500);
    }
  },

  createDichVu: async (data) => {
    try {
      if (!data.TenDichVu || !data.DonGia || !data.TinhTrang) {
        throw new ApiError("Thiếu thông tin bắt buộc.", 400);
      }

      const lastDichVu = await DichVu.findOne({
        order: [["MaDichVu", "DESC"]],
      });

      let newId = "DV001";
      if (lastDichVu) {
        const lastNumber = parseInt(lastDichVu.MaDichVu.replace("DV", ""), 10);
        newId = `DV${String(lastNumber + 1).padStart(3, "0")}`;
      }

      data.MaDichVu = newId;

      return await DichVu.create(data);
    } catch (err) {
      throw err.statusCode ? err : new ApiError("Lỗi khi tạo dịch vụ.", 500);
    }
  },

  updateDichVu: async (id, data) => {
    try {
      if (!data || Object.keys(data).length === 0) {
        throw new ApiError("Không có dữ liệu để cập nhật.", 400);
      }
      const [affectedRows] = await DichVu.update(data, {
        where: { MaDichVu: id },
      });
      if (affectedRows === 0)
        throw new ApiError("Không tìm thấy dịch vụ để cập nhật.", 404);
      return affectedRows;
    } catch (err) {
      throw err.statusCode
        ? err
        : new ApiError("Cập nhật dịch vụ thất bại.", 500);
    }
  },

  deleteDichVu: async (id) => {
    try {
      const deletedRows = await DichVu.destroy({ where: { MaDichVu: id } });
      if (deletedRows === 0)
        throw new ApiError("Không tìm thấy dịch vụ để xóa.", 404);
      return deletedRows;
    } catch (err) {
      throw err.statusCode ? err : new ApiError("Xóa dịch vụ thất bại.", 500);
    }
  },

  searchDichVu: async (query, limit, offset) => {
    try {
      const { maDichVu, tenDichVu, giaTu, giaDen, tinhTrang } = query;
      const where = {};

      if (maDichVu) {
        where.MaDichVu = { [Op.like]: `%${maDichVu}%` };
      }

      if (tenDichVu) {
        where.TenDichVu = { [Op.like]: `%${tenDichVu}%` };
      }

      if (giaTu !== undefined && giaDen !== undefined) {
        if (isNaN(giaTu) || isNaN(giaDen)) {
          throw new ApiError("Khoảng giá không hợp lệ.", 400);
        }
        where.DonGia = { [Op.between]: [Number(giaTu), Number(giaDen)] };
      }

      if (tinhTrang) {
        where.TinhTrang = { [Op.like]: `%${tinhTrang}%` };
      }

      return await DichVu.findAll({ where, limit, offset });
    } catch (err) {
      throw err.statusCode
        ? err
        : new ApiError("Tìm kiếm dịch vụ thất bại.", 500);
    }
  },
};

module.exports = DichVuService;
