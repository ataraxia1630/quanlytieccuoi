const { LoaiSanh, Sanh, PhieuDatTiec } = require('../models');
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

  getLatestLoaiSanh: async () => {
    try {
      const loaisanh = await LoaiSanh.findOne({
        order: [['MaLoaiSanh', 'DESC']],
      });
      return loaisanh || null;
    } catch (error) {
      throw new ApiError(
        500,
        'Lấy thông tin loại sảnh mới nhất thất bại! Vui lòng thử lại sau.'
      );
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
        throw new ApiError(
          400,
          `Loại sảnh "${data.TenLoaiSanh}" đã tồn tại trong hệ thống.`
        );
      }

      const latest = await LoaiSanhService.getLatestLoaiSanh();
      let newMaLoaiSanh = 'LS001';
      if (latest && latest.MaLoaiSanh) {
        const number = parseInt(latest.MaLoaiSanh.replace('LS', '')) || 0;
        newMaLoaiSanh = 'LS' + (number + 1).toString().padStart(3, '0');
      }

      return await LoaiSanh.create({
        ...data,
        MaLoaiSanh: newMaLoaiSanh,
      });
    } catch (error) {
      console.log(error);
      throw new ApiError(
        500,
        error.message || 'Tạo loại sảnh mới thất bại! Vui lòng thử lại sau.'
      );
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

      if (data.TenLoaiSanh && data.TenLoaiSanh !== loaisanh.TenLoaiSanh) {
        const existing = await LoaiSanh.findOne({
          where: {
            TenLoaiSanh: data.TenLoaiSanh,
            MaLoaiSanh: { [Op.ne]: id },
          },
        });
        if (existing) {
          throw new ApiError(
            400,
            `Loại sảnh "${data.TenLoaiSanh}" đã tồn tại trong hệ thống.`
          );
        }
      }
      return await loaisanh.update(data);
    } catch (error) {
      throw new ApiError(
        500,
        error.message || 'Cập nhật loại sảnh thất bại! Vui lòng thử lại sau.'
      );
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
      // ktra cac sanh dang sd
      let message;
      const sanhs = await Sanh.findAll({
        attributes: ['MaSanh'],
        where: { MaLoaiSanh: id },
      });
      if (sanhs.length === 0) {
        await loaisanh.destroy();
        message = 'success';
        return message;
      }
      const maSanhList = sanhs.map((sanh) => sanh.MaSanh);
      const pdt = await PhieuDatTiec.findOne({
        where: {
          MaSanh: { [Op.in]: maSanhList },
        },
      });
      if (pdt) {
        message = `Không thể xóa! Có sảnh thuộc loại sảnh này đã được đặt!`;
        return message;
      }
      await loaisanh.destroy();
      message = 'success';
      return message;
    } catch (error) {
      throw new ApiError(
        500,
        error.message || 'Xóa thất bại! Vui lòng thử lại sau.'
      );
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
