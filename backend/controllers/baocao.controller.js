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

  XuatFile: async (req, res, next) => {},
};

module.exports = { BaoCaoController };
