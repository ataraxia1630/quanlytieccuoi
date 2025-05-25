const { MonAn, Ct_DatBan } = require('../models');
const { Op } = require('sequelize');
const ApiError = require('../utils/apiError');
const { uploadImage } = require('./image.service');

const MonAnStatus = {
  AVAILABLE: 'AVAILABLE',
  UNAVAILABLE: 'UNAVAILABLE',
  NO_LONGER_AVAILABLE: 'NO_LONGER_AVAILABLE',
};

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
      throw new ApiError(
        500,
        'Lấy danh sách các món ăn có thể đặt thất bại! Vui lòng thử lại sau.'
      );
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
      throw new ApiError(
        500,
        'Lấy danh sách các món ăn thất bại! Vui lòng kiểm tra lại tham số hoặc thử lại sau.'
      );
    }
  },

  getMonAnById: async (id) => {
    try {
      if (!id) throw new ApiError(400, 'Thiếu trường id trong req.params!');
      const monan = await MonAn.findByPk(id);

      if (!monan)
        throw new ApiError(404, 'Không tìm thấy món ăn với ID cung cấp.');
      return monan;
    } catch (error) {
      throw new ApiError(
        500,
        'Lấy thông tin món ăn thất bại! Vui lòng thử lại sau.'
      );
    }
  },

  getLatestMonAn: async () => {
    try {
      const monan = await MonAn.findOne({
        order: [['MaMonAn', 'DESC']],
      });
      return monan || null;
    } catch (error) {
      throw new ApiError(
        500,
        'Lấy thông tin món ăn mới nhất thất bại! Vui lòng thử lại sau.'
      );
    }
  },

  createMonAn: async (data, file) => {
    try {
      const existing = await MonAn.findOne({
        where: {
          TenMonAn: data.TenMonAn,
        },
      });

      if (existing)
        throw new ApiError(
          400,
          `Món ăn "${data.TenMonAn}" đã tồn tại trong hệ thống.`
        );

      let newMaMonAn = 'MA00000001';
      const latestMonAn = await MonAnService.getLatestMonAn();
      console.log('Latest MonAn:', latestMonAn);
      if (latestMonAn && latestMonAn.MaMonAn) {
        let latestNumber = parseInt(latestMonAn.MaMonAn.replace('MA', '')) || 0;
        let newNumber = latestNumber + 1;
        newMaMonAn = `MA${newNumber.toString().padStart(8, '0')}`;
      }

      let existingMaMonAn = await MonAn.findOne({
        where: { MaMonAn: newMaMonAn },
      });
      while (existingMaMonAn) {
        const currentNumber = parseInt(newMaMonAn.replace('MA', '')) || 0;
        newMaMonAn = `MA${(currentNumber + 1).toString().padStart(8, '0')}`;
        existingMaMonAn = await MonAn.findOne({
          where: { MaMonAn: newMaMonAn },
        });
      }
      console.log('New MaMonAn:', newMaMonAn);

      let imageUrl = null;
      if (file && file.buffer) {
        const result = await uploadImage(file.buffer);
        imageUrl = result.secure_url;
      }

      return await MonAn.create({
        ...data,
        MaMonAn: newMaMonAn,
        HinhAnh: imageUrl,
        TinhTrang: data.TinhTrang || MonAnStatus.AVAILABLE,
      });
    } catch (error) {
      console.error('Lỗi khi tạo món ăn:', error);
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        500,
        'Tạo món ăn mới thất bại! Vui lòng thử lại sau.' + error.message
      );
    }
  },

  updateMonAn: async (id, data, file) => {
    try {
      if (!id) {
        throw new ApiError(400, 'Thiếu trường id trong req.params');
      }
      if (!data) {
        throw new ApiError(400, 'Thiếu req.data');
      }
      const monan = await MonAn.findByPk(id);
      if (!monan)
        throw new ApiError(404, 'Không tìm thấy món ăn với ID cung cấp.');

      if (data.TenMonAn && data.TenMonAn !== monan.TenMonAn) {
        const existing = await MonAn.findOne({
          where: {
            TenMonAn: data.TenMonAn,
            id: { [Op.ne]: id },
          },
        });
        if (existing) {
          throw new ApiError(
            400,
            `Món ăn "${data.TenMonAn}" đã tồn tại trong hệ thống.`
          );
        }
      }

      const updateData = { ...data };
      if (file && file.buffer) {
        const result = await uploadImage(file.buffer);
        updateData.HinhAnh = result.secure_url;
      }

      return await monan.update(updateData);
    } catch (error) {
      throw new ApiError(
        500,
        'Cập nhật món ăn thất bại! Vui lòng thử lại sau.'
      );
    }
  },

  checkForeignKeyConstraints: async (id) => {
    try {
      const orderDetail = await Ct_DatBan.findOne({
        where: {
          MaMonAn: id,
        },
      });
      return !!orderDetail;
    } catch (error) {
      throw new ApiError(
        500,
        'Kiểm tra ràng buộc khóa ngoại thất bại! Vui lòng thử lại sau.'
      );
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
          'Xóa thất bại!\nKhông tìm thấy món ăn với ID cung cấp.'
        );
      const hasConstraints = await MonAnService.checkForeignKeyConstraints(id);
      if (hasConstraints) {
        await monan.update({ TinhTrang: MonAnStatus.NO_LONGER_AVAILABLE });
        return {
          action: 'updated',
          message:
            'Món ăn đã hoặc đang được đặt, chuyển trạng thái thành "Ngừng bán".',
        };
      }
      await monan.destroy();
      return { action: 'deleted' };
    } catch (error) {
      throw new ApiError(500, 'Xóa thất bại!\nVui lòng thử lại sau.');
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
