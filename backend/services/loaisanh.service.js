const { LoaiSanh } = require('../models');
const { Op } = require('sequelize');
const ApiError = require('../utils/apiError');

const LoaiSanhService = {
  getAllLoaiSanh: async (
    page = 1,
    limit = 10,
    filters = [],
    search = '',
    sort = ''
  ) => {
    try {
      const offset = (page - 1) * limit;
      const where = {};

      if (search) {
        where[Op.or] = [
          { TenLoaiSanh: { [Op.like]: `%${search.toLowerCase()}%` } },
          { MaLoaiSanh: { [Op.like]: `%${search.toLowerCase()}%` } },
        ];
      }

      if (
        filters.price &&
        filters.price.min != null &&
        filters.price.max != null
      ) {
        where.DonGiaBanToiThieu = {
          [Op.between]: [filters.price.min, filters.price.max],
        };
      }

      const order = [];
      switch (sort) {
        case 'name_asc':
          order.push(['TenLoaiSanh', 'ASC']);
          break;
        case 'name_desc':
          order.push(['TenLoaiSanh', 'DESC']);
          break;
        case 'price_asc':
          order.push(['DonGiaBanToiThieu', 'ASC']);
          break;
        case 'price_desc':
          order.push(['DonGiaBanToiThieu', 'DESC']);
          break;
        default:
          order.push(['MaLoaiSanh', 'ASC']);
      }

      const { count, rows } = await LoaiSanh.findAndCountAll({
        where,
        limit,
        offset,
        order,
      });

      return {
        total: count,
        data: rows,
      };
    } catch (error) {
      throw new ApiError(500, 'Lấy danh sách các loại sảnh thất bại!');
    }
  },

  getLoaiSanhById: async (id) => {
    try {
      if (!id)
        if (!id) throw new ApiError(400, 'Thiếu trường id trong req.params!');

      const loaisanh = await LoaiSanh.findByPk(id);
      if (!loaisanh)
        throw new ApiError(
          404,
          'Không tìm thấy, có thể id loại sảnh không đúng hoặc loại sảnh đã bị xóa!'
        );
      return loaisanh;
    } catch (error) {
      throw new ApiError(500, 'Lấy loại sảnh thất bại!');
    }
  },

  createLoaiSanh: async (data) => {
    try {
      const existing = await LoaiSanh.findOne({
        where: {
          TenLoaiSanh: data.TenLoaiSanh,
        },
      });
      if (existing) {
        throw new ApiError(400, 'Thêm mới thất bại!\nLoại sảnh đã tồn tại.');
      }
      return await LoaiSanh.create(data);
    } catch (error) {
      throw new ApiError(500, 'Thêm mới thất bại\nLỗi server.');
    }
  },

  updateLoaiSanh: async (id, data) => {
    try {
      if (!id) throw new ApiError(400, 'Thiếu trường id trong req.params');

      const loaisanh = await LoaiSanh.findByPk(id);
      if (!loaisanh) {
        throw new ApiError(
          404,
          'Cập nhật thất bại!\nKhông tìm thấy loại sảnh này trong CSDL!'
        );
      }
      return await loaisanh.update(data);
    } catch (error) {
      throw new ApiError(500, 'Xóa thất bại!\nLỗi server!');
    }
  },

  deleteLoaiSanh: async (id) => {
    try {
      if (!id) {
        throw new ApiError(400, 'Thiếu trường id trong req.params');
      }
      const loaisanh = await LoaiSanh.findByPk(id);
      if (!loaisanh)
        throw new ApiError(
          404,
          'Xóa thất bại!\nKhông tìm thấy loại sảnh này trong CSDL!'
        );
      await loaisanh.destroy();
    } catch (error) {
      throw new ApiError(500, 'Xóa thất bại!\nLỗi server!');
    }
  },

  deleteAllLoaiSanh: async () => {
    try {
      await LoaiSanh.destroy({
        where: {},
        truncate: true,
      });
    } catch (error) {
      throw new Error(
        'Error deleting all loai sanh in database (service): ' + error.message
      );
    }
  },
};

module.exports = { LoaiSanhService };
