const { ThamSo } = require('../models');
const { Op } = require('sequelize');
const ApiError = require('../utils/apiError');

// Chuẩn hóa chuỗi tìm kiếm
const normalizeString = (str) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .trim();
};

const nameMap = {
  ThoiDiemThanhToanSoVoiNgayDaiTiec:
    'Thời điểm thanh toán so với ngày đãi tiệc',
  TyLePhat: 'Tỷ lệ phạt',
  ApDungQDPhatThanhToanTre: 'Áp dụng quy định phạt thanh toán trễ',
};

const ThamSoService = {
  mapToResponse(thamSo) {
    return {
      TenThamSo: thamSo.TenThamSo,
      GiaTri: thamSo.GiaTri,
      displayName: nameMap[thamSo.TenThamSo] || thamSo.TenThamSo,
    };
  },

  getAllThamSo: async (limit = 30, offset = 0, search = '') => {
    try {
      const normalizedSearch = normalizeString(search);
      const where = search
        ? {
            [Op.or]: [
              { TenThamSo: { [Op.like]: `%${search}%` } },
              {
                TenThamSo: {
                  [Op.in]: Object.keys(nameMap).filter((key) => {
                    const displayName = nameMap[key];
                    return (
                      normalizeString(displayName).includes(normalizedSearch) ||
                      normalizeString(key).includes(normalizedSearch)
                    );
                  }),
                },
              },
            ],
          }
        : {};
      const thamSoList = await ThamSo.findAll({ where, limit, offset });
      return thamSoList.map((thamSo) => ThamSoService.mapToResponse(thamSo));
    } catch (err) {
      console.error('Lỗi trong getAllThamSo:', err);
      throw err.statusCode
        ? err
        : new ApiError(500, 'Lỗi khi lấy danh sách tham số.');
    }
  },

  getThamSoByName: async (tenThamSo) => {
    try {
      const thamSo = await ThamSo.findByPk(tenThamSo);
      if (!thamSo) throw new ApiError(404, 'Không tìm thấy tham số.');
      return ThamSoService.mapToResponse(thamSo);
    } catch (err) {
      throw err.statusCode
        ? err
        : new ApiError(500, 'Lỗi khi lấy thông tin tham số.');
    }
  },

  updateThamSo: async (tenThamSo, giaTri) => {
    try {
      const thamSo = await ThamSo.findByPk(tenThamSo);
      if (!thamSo) throw new ApiError(404, 'Không tìm thấy tham số.');
      thamSo.GiaTri = giaTri;
      await thamSo.save();
      return ThamSoService.mapToResponse(thamSo);
    } catch (err) {
      throw err.statusCode
        ? err
        : new ApiError(500, 'Lỗi khi cập nhật tham số.');
    }
  },
};

module.exports = ThamSoService;
