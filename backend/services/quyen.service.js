const { USER, NHOM, QUYEN } = require('../models');
const ApiError = require('../utils/apiError');

const PermissionService = {
  getPerOfUser: async (username) => {
    try {
      const user = await USER.findByPk(username, {
        attributes: ['MaNhom'],
      });
      if (!user) throw new ApiError(404, 'User không tồn tại!');
      const group = await NHOM.findByPk(user.MaNhom, {
        include: {
          model: QUYEN,
          attributes: ['TenQuyen'],
        },
      });
      if (!group) throw new ApiError(404, 'Nhóm không tồn tại');
      const permissions = group.QUYENs.map((q) => q.TenQuyen);
      return permissions;
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(500, 'Lỗi server! Vui lòng thử lại sau.');
    }
  },
};

module.exports = { PermissionService };
