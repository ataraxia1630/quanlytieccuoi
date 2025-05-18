const { BaoCaoService } = require('../services/baocao.service');

const BaoCaoController = {
  XemBaoCao: async (req, res, next) => {
    try {
      const baocao = await BaoCaoService.XemBaoCao(req.params);
      return baocao;
    } catch (error) {
      next(error);
    }
  },

  XuatBaoCao: async (req, res, next) => {
    try {
      await BaoCaoService.XuatBaoCao(req.params, res);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { BaoCaoController };
