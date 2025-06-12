const { USER } = require('../models');
const ApiError = require('../utils/apiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

const AuthService = {
  login: async (username, password) => {
    try {
      const user = await USER.findByPk(username);
      if (!user) throw new ApiError(400, 'User không tồn tại!');
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword)
        throw new ApiError(400, 'Username hoặc password không đúng!');
      const token = jwt.sign({ username }, SECRET_KEY, {
        expiresIn: '4h',
      });
      return token;
    } catch (error) {
      throw new ApiError(error || 500, 'Lỗi server! Vui long thử lại sau.');
    }
  },

  changePassword: async (username, oldPassword, newPassword) => {
    try {
      const user = await USER.findByPk(username);
      if (!user) throw new ApiError(400, 'User không tồn tại!');
      const isValidPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isValidPassword)
        throw new ApiError(400, 'Mật khẩu không đúng! Vui lòng thử lại.');
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await USER.update({ password: hashedPassword }, { where: { username } });
    } catch (error) {
      throw new ApiError(error || 500, 'Lỗi server! Vui long thử lại sau.');
    }
  },
};

module.exports = { AuthService };
