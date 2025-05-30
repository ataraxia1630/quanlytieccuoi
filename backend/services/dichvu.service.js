const { DichVu } = require("../models");
const { Ct_DichVu } = require("../models");
const { Op } = require("sequelize");
const ApiError = require("../utils/apiError.js");

const DichVuService = {
  getAllDichVu: async (limit, offset) => {
    try {
      return await DichVu.findAll({ limit, offset });
    } catch (err) {
      throw new ApiError(500, "Không thể lấy danh sách dịch vụ.");
    }
  },

  getDichVuById: async (id) => {
    try {
      const dichvu = await DichVu.findByPk(id);
      if (!dichvu) throw new ApiError(404, "Không tìm thấy dịch vụ.");
      return dichvu;
    } catch (err) {
      throw err.statusCode
        ? err
        : new ApiError(500, "Lỗi khi lấy thông tin dịch vụ theo ID.");
    }
  },

  getActiveDichVu: async (limit, offset) => {
    try {
      return await DichVu.findAll({
        where: { TinhTrang: "Có sẵn" },
        limit,
        offset,
      });
    } catch (err) {
      throw new ApiError(500, "Không thể lấy danh sách dịch vụ đang áp dụng.");
    }
  },

  createDichVu: async (data) => {
    try {
      if (!data.TenDichVu || !data.DonGia || !data.TinhTrang) {
        throw new ApiError(400, "Thiếu thông tin bắt buộc.");
      }

      // Kiểm tra trùng tên dịch vụ
      const existed = await DichVu.findOne({
        where: { TenDichVu: data.TenDichVu },
      });
      if (existed) {
        throw new ApiError(400, "Tên dịch vụ đã tồn tại.");
      }

      // Tạo mã dịch vụ mới
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
      throw err.statusCode ? err : new ApiError(500, "Lỗi khi tạo dịch vụ.");
    }
  },

  updateDichVu: async (id, data) => {
    try {
      if (!data || Object.keys(data).length === 0) {
        throw new ApiError(400, "Không có dữ liệu để cập nhật.");
      }
      const [affectedRows] = await DichVu.update(data, {
        where: { MaDichVu: id },
      });
      if (affectedRows === 0)
        throw new ApiError(404, "Không tìm thấy dịch vụ để cập nhật.");
      return affectedRows;
    } catch (err) {
      throw err.statusCode
        ? err
        : new ApiError(500, "Cập nhật dịch vụ thất bại.");
    }
  },

  deleteDichVu: async (id) => {
    try {
      const dichVu = await DichVu.findOne({ where: { MaDichVu: id } });

      if (!dichVu) {
        throw new ApiError(404, "Không tìm thấy dịch vụ.");
      }

      const hasRelatedRecords = await Ct_DichVu.findOne({
        where: { MaDichVu: id },
      });

      if (hasRelatedRecords) {
        if (dichVu.TinhTrang === "Ngừng cung cấp") {
          return {
            status: "already-soft-deleted",
            message:
              "Dịch vụ đã ngừng cung cấp và không thể xóa vì có trong phiếu đặt tiệc.",
          };
        }

        const [affectedRows] = await DichVu.update(
          { TinhTrang: "Ngừng cung cấp" },
          { where: { MaDichVu: id } }
        );

        if (affectedRows === 0)
          throw new ApiError(
            404,
            "Không tìm thấy dịch vụ để cập nhật trạng thái."
          );

        return {
          status: "soft-deleted",
          message:
            "Dịch vụ sang trạng thái ngừng cung cấp do có trong phiếu đặt tiệc.",
        };
      } else {
        const deletedRows = await DichVu.destroy({ where: { MaDichVu: id } });

        if (deletedRows === 0)
          throw new ApiError(404, "Không tìm thấy dịch vụ để xóa.");

        return {
          status: "deleted",
          message: "Xóa dịch vụ thành công",
        };
      }
    } catch (err) {
      throw err.statusCode ? err : new ApiError(500, "Xóa dịch vụ thất bại.");
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

      if (giaTu !== undefined || giaDen !== undefined) {
        if (
          (giaTu !== undefined && isNaN(giaTu)) ||
          (giaDen !== undefined && isNaN(giaDen))
        ) {
          throw new ApiError(400, "Khoảng giá không hợp lệ.");
        }

        if (giaTu !== undefined && giaDen !== undefined) {
          where.DonGia = { [Op.between]: [Number(giaTu), Number(giaDen)] };
        } else if (giaTu !== undefined) {
          where.DonGia = { [Op.gte]: Number(giaTu) };
        } else if (giaDen !== undefined) {
          where.DonGia = { [Op.lte]: Number(giaDen) };
        }
      }

      if (tinhTrang) {
        if (Array.isArray(tinhTrang) && tinhTrang.length > 0) {
          where.TinhTrang = { [Op.in]: tinhTrang };
        } else if (typeof tinhTrang === "string") {
          where.TinhTrang = tinhTrang;
        }
      }

      return await DichVu.findAll({ where, limit, offset });
    } catch (err) {
      throw err.statusCode
        ? err
        : new ApiError(500, "Tìm kiếm dịch vụ thất bại.");
    }
  },
};

module.exports = DichVuService;
