const { NHOM, PHANQUYEN, QUYEN, sequelize } = require('../models');
const { Op } = require('sequelize');
const ApiError = require('../utils/apiError');

const GroupService = {
  createNew: async (data) => {
    const t = await sequelize.transaction();
    try {
      const { TenNhom, MaQuyenArray } = data;
      const lastGroup = await NHOM.findOne({
        order: [['MaNhom', 'DESC']],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      let nextId = 1;
      if (lastGroup && lastGroup.MaNhom) {
        const lastNumber = parseInt(lastGroup.MaNhom.replace('G', ''), 10);
        nextId = lastNumber + 1;
      }
      const MaNhom = `G${String(nextId).padStart(4, '0')}`;

      const group = await NHOM.create({ MaNhom, TenNhom }, { transaction: t });

      const array = MaQuyenArray.map((id) => ({ MaNhom, MaQuyen: id }));
      await PHANQUYEN.bulkCreate(array, { transaction: t });

      await t.commit();
      return group;
    } catch (error) {
      await t.rollback();
      throw error instanceof ApiError
        ? error
        : new ApiError(500, 'Lỗi server! Vui lòng thử lại sau.');
    }
  },

  delete: async (MaNhom) => {
    try {
      const group = await NHOM.findByPk(MaNhom);
      if (!group) throw new ApiError(404, 'Nhóm người dùng không tồn tại!');
      await group.destroy();
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(500, 'Lỗi server! Vui lòng thử lại sau.');
    }
  },

  update: async (MaNhom, data) => {
    const t = await sequelize.transaction();
    try {
      const { TenNhom, MaQuyenArray } = data;

      const group = await NHOM.findByPk(MaNhom, { transaction: t });
      if (!group)
        throw new ApiError(404, `Không tìm thấy nhóm với mã: ${MaNhom}`);

      // Cập nhật tên nhóm
      group.TenNhom = TenNhom;
      await group.save({ transaction: t });

      // Xoá tất cả quyền cũ
      await PHANQUYEN.destroy({ where: { MaNhom }, transaction: t });

      // Tạo lại quyền mới
      const newPermissions = MaQuyenArray.map((id) => ({
        MaNhom,
        MaQuyen: id,
      }));
      await PHANQUYEN.bulkCreate(newPermissions, { transaction: t });

      await t.commit();
      return group;
    } catch (error) {
      await t.rollback();
      throw error instanceof ApiError
        ? error
        : new ApiError(
            500,
            'Lỗi server khi cập nhật nhóm! Vui lòng thử lại sau.'
          );
    }
  },

  getAll: async (search = '') => {
    try {
      const where = {};
      if (search) {
        where[Op.or] = [
          { TenNhom: { [Op.like]: `%${search.toLowerCase()}%` } },
          { MaNhom: { [Op.like]: `%${search.toLowerCase()}%` } },
        ];
      }

      const groups = await NHOM.findAll({
        where,
        include: {
          model: QUYEN,
          attributes: ['MaQuyen', 'TenQuyen'],
          through: { attributes: [] },
        },
      });
      return groups;
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(
            500,
            'Lỗi server khi cập nhật nhóm! Vui lòng thử lại sau.'
          );
    }
  },
};

module.exports = { GroupService };
