const { MonAn } = require('../models');
const { Op } = require('sequelize');
const ApiError = require('../utils/apiError');

const MonAnStatus = {
  AVAILABLE: 'AVAILABLE',
  UNAVAILABLE: 'UNAVAILABLE',
  NO_LONGER_AVAILABLE: 'NO_LONGER_AVAILABLE',
};

// const StatusArray = ['AVAILABLE', 'UNAVAILABLE', 'NO_LONGER_AVAILABLE'];

const MonAnService = {
  getAvailableMonAn: async () => {
    try {
      const { rows } = await MonAn.findAndCountAll({
        where: {
          TinhTrang: MonAnStatus.AVAILABLE,
        },
      });
      return rows;
    } catch (error) {
      throw new ApiError(500, 'Lấy danh sách các món ăn có thể đặt thất bại!');
    }
  },

  // lay tat ca (pagination)
  // search theo MaMonAn || TenMonAn
  // filter: DonGia range || && TinhTrang
  // sort: TenMonAn  || DonGia || default: MaMonAn
  getAllMonAn: async (
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
          { TenMonAn: { [Op.like]: `%${search.toLowerCase()}%` } },
          { MaMonAn: { [Op.like]: `%${search.toLowerCase()}%` } },
        ];
      }

      if (filters.status && filters.status.length > 0) {
        where.TinhTrang = { [Op.in]: filters.status };
      }

      if (
        filters.price &&
        filters.price.min != null &&
        filters.price.max != null
      ) {
        where.DonGia = { [Op.between]: [filters.price.min, filters.price.max] };
      }

      const order = [];
      switch (sort) {
        case 'name_asc':
          order.push(['TenMonAn', 'ASC']);
          break;
        case 'name_desc':
          order.push(['TenMonAn', 'DESC']);
          break;
        case 'price_asc':
          order.push(['DonGia', 'ASC']);
          break;
        case 'price_desc':
          order.push(['DonGia', 'DESC']);
          break;
        default:
          order.push(['MaMonAn', 'ASC']);
      }

      const { count, rows } = await MonAn.findAndCountAll({
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
      throw new ApiError(500, 'Lấy danh sách các món ăn thất bại!');
    }
  },

  getMonAnById: async (id) => {
    try {
      if (!id) throw new ApiError(400, 'Thiếu trường id trong req.params!');
      const monan = await MonAn.findByPk(id);

      if (!monan)
        throw new ApiError(
          404,
          'Không tìm thấy, có thể id món ăn không đúng hoặc món ăn đã bị xóa!'
        );
      return monan;
    } catch (error) {
      throw new ApiError(500, 'Lấy món ăn thất bại');
    }
  },

  createMonAn: async (data) => {
    try {
      if (!data || !data.MaMonAn || !data.TenMonAn || !data.DonGia) {
        throw new ApiError(400, 'Thiếu thông tin món ăn cần thiết.');
      }
      const existing = await MonAn.findOne({
        where: {
          TenMonAn: data.TenMonAn,
        },
      });

      if (existing)
        throw new ApiError(400, 'Thêm mới thất bại!\nMón ăn đã tồn tại.');

      return await MonAn.create(data);
    } catch (error) {
      throw new ApiError(500, 'Thêm mới thất bại\nLỗi server.');
    }
  },

  updateMonAn: async (id, data) => {
    try {
      if (!id) {
        throw new ApiError(400, 'Thiếu trường id trong req.params');
      }
      if (!data) {
        throw new ApiError(400, 'Thiếu req.data');
      }
      const monan = await MonAn.findByPk(id);
      if (!monan)
        throw new ApiError(
          404,
          'Cập nhật thất bại!\nKhông tìm thấy món ăn này trong CSDL!'
        );
      return await monan.update(data);
    } catch (error) {
      throw new ApiError(500, 'Cập nhật thất bại!\nLỗi server!');
    }
  },

  deleteMonAn: async (id) => {
    try {
      if (!id) {
        throw new ApiError(400, 'Thiếu trường id trong req.params');
      }
      const monan = await MonAn.findByPk(id);
      if (!monan)
        throw new ApiError(
          404,
          'Xóa thất bại!\nKhông tìm thấy món ăn này trong CSDL!'
        );
      return await monan.update({ TinhTrang: MonAnStatus.NO_LONGER_AVAILABLE });
    } catch (error) {
      throw new ApiError(500, 'Cập nhật thất bại!\nLỗi server!');
    }
  },

  markAllMonAnAsDeleted: async () => {
    try {
      await MonAn.update(
        { TinhTrang: MonAnStatus.NO_LONGER_AVAILABLE },
        {
          where: {
            TinhTrang: {
              [Op.in]: [MonAnStatus.AVAILABLE, MonAnStatus.UNAVAILABLE],
            },
          },
        }
      );
    } catch (error) {
      throw new ApiError(500, 'Cập nhật thất bại!\nLỗi server!');
    }
  },
};

module.exports = { MonAnService };
