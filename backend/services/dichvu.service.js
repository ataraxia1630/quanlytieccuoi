const { DichVu } = require('../models');
const { Ct_DichVu } = require('../models');
const { Op, Sequelize } = require('sequelize');
const ApiError = require('../utils/apiError.js');
const removeDiacritics = require('../utils/string.util.js');

const DichVuService = {
  getAllDichVu: async (limit, offset) => {
    try {
      return await DichVu.findAll({ limit, offset });
    } catch (err) {
      throw new ApiError(500, 'Không thể lấy danh sách dịch vụ.');
    }
  },

  getDichVuById: async (id) => {
    try {
      const dichvu = await DichVu.findByPk(id);
      if (!dichvu) throw new ApiError(404, 'Không tìm thấy dịch vụ.');
      return dichvu;
    } catch (err) {
      throw err.statusCode
        ? err
        : new ApiError(500, 'Lỗi khi lấy thông tin dịch vụ theo ID.');
    }
  },

  getActiveDichVu: async (limit, offset) => {
    try {
      return await DichVu.findAll({
        where: { TinhTrang: 'Có sẵn' },
        limit,
        offset,
      });
    } catch (err) {
      throw new ApiError(500, 'Không thể lấy danh sách dịch vụ đang áp dụng.');
    }
  },

  createDichVu: async (data) => {
    try {
      if (!data.TenDichVu || !data.TinhTrang)
        throw new Error('Tên dịch vụ và tình trạng là bắt buộc');
      if (isNaN(data.DonGia) || data.DonGia < 0)
        throw new Error('Giá phải là số không âm');

      // Kiểm tra trùng tên dịch vụ
      const existed = await DichVu.findOne({
        where: { TenDichVu: data.TenDichVu },
      });
      if (existed) {
        throw new ApiError(400, 'Tên dịch vụ đã tồn tại.');
      }

      // Tạo mã dịch vụ mới
      const lastDichVu = await DichVu.findOne({
        order: [['MaDichVu', 'DESC']],
      });

      let newId = 'DV001';
      if (lastDichVu) {
        const lastNumber = parseInt(lastDichVu.MaDichVu.replace('DV', ''), 10);
        newId = `DV${String(lastNumber + 1).padStart(3, '0')}`;
      }

      data.MaDichVu = newId;

      return await DichVu.create(data);
    } catch (err) {
      throw err.statusCode ? err : new ApiError(500, 'Lỗi khi tạo dịch vụ.');
    }
  },

  updateDichVu: async (id, data) => {
    try {
      if (!data || Object.keys(data).length === 0) {
        throw new ApiError(400, 'Không có dữ liệu để cập nhật.');
      }
      const [affectedRows] = await DichVu.update(data, {
        where: { MaDichVu: id },
      });
      if (affectedRows === 0)
        throw new ApiError(404, 'Không tìm thấy dịch vụ để cập nhật.');
      return affectedRows;
    } catch (err) {
      throw err.statusCode
        ? err
        : new ApiError(500, 'Cập nhật dịch vụ thất bại.');
    }
  },

  deleteDichVu: async (id) => {
    try {
      const dichVu = await DichVu.findOne({ where: { MaDichVu: id } });

      if (!dichVu) {
        throw new ApiError(404, 'Không tìm thấy dịch vụ.');
      }

      const hasRelatedRecords = await Ct_DichVu.findOne({
        where: { MaDichVu: id },
      });

      if (hasRelatedRecords) {
        if (dichVu.TinhTrang === 'Ngừng cung cấp') {
          return {
            status: 'already-soft-deleted',
            message:
              'Dịch vụ đã ngừng cung cấp và không thể xóa vì đã sử dụng.',
          };
        }

        const [affectedRows] = await DichVu.update(
          { TinhTrang: 'Ngừng cung cấp' },
          { where: { MaDichVu: id } }
        );

        if (affectedRows === 0)
          throw new ApiError(
            404,
            'Không tìm thấy dịch vụ để cập nhật trạng thái.'
          );

        return {
          status: 'soft-deleted',
          message:
            'Dịch vụ đã được sử dụng nên đã chuyển sang trạng thái ngừng cung cấp.',
        };
      } else {
        const deletedRows = await DichVu.destroy({ where: { MaDichVu: id } });

        if (deletedRows === 0)
          throw new ApiError(404, 'Không tìm thấy dịch vụ để xóa.');

        return {
          status: 'deleted',
          message: 'Xóa dịch vụ thành công',
        };
      }
    } catch (err) {
      throw err.statusCode ? err : new ApiError(500, 'Xóa dịch vụ thất bại.');
    }
  },

  searchDichVu: async (query, limit, offset) => {
    try {
      const { maDichVu, tenDichVu, giaTu, giaDen, tinhTrang, searchTerm } =
        query || {};
      const where = {};

      const buildWhereWithTerm = (term) => {
        const termWithSpaces = removeDiacritics(term, true);
        const termNoSpaces = removeDiacritics(term, false);

        return [
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('MaDichVu')), {
            [Op.like]: `%${termWithSpaces}%`,
          }),

          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('TenDichVu')), {
            [Op.like]: `%${termWithSpaces}%`,
          }),

          Sequelize.where(
            Sequelize.fn(
              'REPLACE',
              Sequelize.fn('LOWER', Sequelize.col('TenDichVu')),
              ' ',
              ''
            ),
            { [Op.like]: `%${termNoSpaces}%` }
          ),
        ];
      };

      const actualSearchTerm = searchTerm
        ? removeDiacritics(searchTerm, true)
        : '';

      if (actualSearchTerm) {
        where[Op.or] = buildWhereWithTerm(actualSearchTerm);
      } else {
        if (maDichVu?.trim()) {
          const normalizedMa = removeDiacritics(maDichVu, true);
          where[Op.or] = [
            Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('MaDichVu')), {
              [Op.like]: `%${normalizedMa}%`,
            }),
          ];
        }

        if (tenDichVu?.trim()) {
          where[Op.or] = buildWhereWithTerm(tenDichVu);
        }
      }

      const min = giaTu !== undefined ? Number(giaTu) : undefined;
      const max = giaDen !== undefined ? Number(giaDen) : undefined;
      if (
        (min !== undefined && isNaN(min)) ||
        (max !== undefined && isNaN(max))
      ) {
        throw new ApiError(400, 'Khoảng giá không hợp lệ.');
      }
      if (min !== undefined || max !== undefined) {
        where.DonGia =
          min !== undefined && max !== undefined
            ? { [Op.between]: [min, max] }
            : min !== undefined
            ? { [Op.gte]: min }
            : { [Op.lte]: max };
      }

      if (tinhTrang) {
        if (Array.isArray(tinhTrang)) {
          where.TinhTrang = { [Op.in]: tinhTrang };
        } else if (typeof tinhTrang === 'string' && tinhTrang.trim()) {
          where.TinhTrang = tinhTrang.trim();
        }
      }

      const result = await DichVu.findAll({ where, limit, offset });
      return result;
    } catch (err) {
      console.error('Search error:', err);
      throw err.statusCode
        ? err
        : new ApiError(500, 'Tìm kiếm dịch vụ thất bại.');
    }
  },
};

module.exports = DichVuService;
