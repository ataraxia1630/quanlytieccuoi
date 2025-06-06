const { AuthService } = require('../services/auth.service');

const AuthController = {
  login: async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const token = await AuthService.login(username, password);
      return res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const { username } = req.user;
      await AuthService.changePassword(username, oldPassword, newPassword);
      res.status(200).json({ message: 'Change password successfully!' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { AuthController };
