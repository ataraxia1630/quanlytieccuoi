const { USER, NHOM } = require('../models');
const ApiError = require('../utils/apiError');
const bcrypt = require('bcrypt');

const UserService = {
  isExisted: async (username) => {
    try {
      const user = await USER.findByPk(username);
      if (!user) return false;
      return true;
    } catch (error) {
      throw new ApiError(500, 'Lỗi trong isExisted');
    }
  },

  createAccount: async (data) => {
    try {
      if (await UserService.isExisted(data.username))
        throw new ApiError(400, 'Đã tồn tại user với username này!');
      if (data.MaNhom) {
        const group = await NHOM.findByPk(data.MaNhom);
        if (!group) throw new ApiError(404, 'Nhóm người dùng không tồn tại!');
      }
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const newUser = await USER.create({ ...data, password: hashedPassword });
      return newUser;
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(500, 'Lỗi server! Vui lòng thử lại sau.');
    }
  },

  deleteAccount: async (username) => {
    try {
      if (!(await UserService.isExisted(username)))
        throw new ApiError(404, 'User không tồn tại!');
      await USER.destroy({ where: { username } });
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(500, 'Lỗi server! Vui lòng thử lại sau.');
    }
  },

  updateAccount: async (username, data) => {
    try {
      const user = await USER.findByPk(username);
      if (!user) throw new ApiError(404, 'User không tồn tại');
      if (data.username)
        throw new ApiError(400, 'Không thể thay đổi username!');
      let updatedData = { ...data };
      let hashedPassword;
      if (data.password) {
        hashedPassword = await bcrypt.hash(data.password, 10);
        updatedData.password = hashedPassword;
      }
      console.log(updatedData);
      return await user.update(updatedData);
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(500, 'Lỗi server! Vui lòng thử lại sau.');
    }
  },

  getAll: async () => {
    try {
      const users = await USER.findAll({
        include: {
          model: NHOM,
          attributes: ['TenNhom'],
        },
      });
      return users;
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(500, 'Lỗi server! Vui lòng thử lại sau.');
    }
  },

  getUsersOfGroup: async (MaNhom) => {
    try {
      const group = await NHOM.findByPk(MaNhom);
      if (!group) throw new ApiError(404, 'Nhóm người dùng không tồn tại!');
      const users = await USER.findAll({ where: { MaNhom } });
      return users;
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(500, 'Lỗi server! Vui lòng thử lại sau.');
    }
  },
};

module.exports = { UserService };
