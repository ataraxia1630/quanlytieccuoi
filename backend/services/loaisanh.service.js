const { LoaiSanh } = require('../models');
const { Op } = require('sequelize');

const LoaiSanhService = {
  getAllLoaiSanh: async (page, limit, filters) => {
    try {
      const offset = (page - 1) * limit;
      const { count, rows } = await LoaiSanh.findAndCountAll({
        where: {
          DonGiaBanToiThieu: {
            [Op.between]: [filters.price.min, filters.price.max],
          },
        },
        limit,
        offset,
        order: [
          ['TenLoaiSanh', filters.nameOrder],
          ['DonGiaBanToiThieu', filters.price.priceOrder],
        ],
      });

      return {
        total: count,
        data: rows,
      };
    } catch (error) {
      throw new Error(
        'Error fetching all loai sanh from database (service): ' + error.message
      );
    }
  },

  getLoaiSanhById: async (id) => {
    try {
      const loaisanh = await LoaiSanh.findOne({
        where: { MaLoaiSanh: id },
      });

      return loaisanh;
    } catch (error) {
      throw new Error(
        'Error fetching loai sanh by id from database (service): ' +
          error.message
      );
    }
  },

  createLoaiSanh: async (data) => {
    try {
      const existing = await LoaiSanh.findOne({
        where: { MaLoaiSanh: data.MaLoaiSanh },
      });
      if (existing) {
        throw new Error('LoaiSanh already exists');
      }
      return await LoaiSanh.create(data);
    } catch (error) {
      throw new Error(
        'Error creating loai sanh in database (service): ' + error.message
      );
    }
  },

  updateLoaiSanh: async (id, data) => {
    try {
      const loaisanh = await LoaiSanh.findOne({
        where: { MaLoaiSanh: id },
      });
      if (!loaisanh) {
        throw new Error('LoaiSanh not found');
      }
      return await loaisanh.update(data);
    } catch (error) {
      throw new Error(
        'Error updating loai sanh in database (service): ' + error.message
      );
    }
  },

  deleteLoaiSanh: async (id) => {
    try {
      const loaisanh = await LoaiSanh.findOne({
        where: { MaLoaiSanh: id },
      });
      if (!loaisanh) {
        throw new Error('LoaiSanh not found');
      }
      await loaisanh.destroy();
    } catch (error) {
      throw new Error(
        'Error deleting loai sanh in database (service): ' + error.message
      );
    }
  },

  deleteAllLoaiSanh: async () => {
    try {
      await LoaiSanh.destroy({
        where: {},
        truncate: true,
      });
    } catch (error) {
      throw new Error(
        'Error deleting all loai sanh in database (service): ' + error.message
      );
    }
  },

  searchLoaiSanhByName: async (name, page, limit, filters) => {
    try {
      const offset = (page - 1) * limit;
      const { count, rows } = await LoaiSanh.findAndCountAll({
        where: {
          [Op.and]: [
            {
              TenLoaiSanh: {
                [Op.like]: `%${name}%`,
              },
            },
            {
              DonGiaBanToiThieu: {
                [Op.between]: [filters.price.min, filters.price.max],
              },
            },
          ],
        },
        limit,
        offset,
        order: [
          ['TenLoaiSanh', filters.nameOrder],
          ['DonGiaBanToiThieu', filters.price.priceOrder],
        ],
      });

      return {
        total: count,
        data: rows,
      };
    } catch (error) {
      throw new Error(
        'Error searching loai sanh by name in database (service): ' +
          error.message
      );
    }
  },
};

module.exports = { LoaiSanhService };
