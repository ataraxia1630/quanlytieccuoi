const { MonAn } = require('../models');
const { Op } = require('sequelize');

const MonAnStatus = {
  AVAILABLE: 'AVAILABLE',
  UNAVAILABLE: 'UNAVAILABLE',
  NO_LONGER_AVAILABLE: 'NO_LONGER_AVAILABLE',
};

const StatusArray = ['AVAILABLE', 'UNAVAILABLE', 'NO_LONGER_AVAILABLE'];

const MonAnService = {
  // filters = {
  //   status: ['AVAILABLE', 'UNAVAILABLE', 'NO_LONGER_AVAILABLE'],
  //   price: { min: 0, max: 10000000, priceOrder: 'ASC' },
  //   nameOrder: 'ASC',
  // }
  getAllMonAn: async (page, limit, filters) => {
    try {
      const offset = (page - 1) * limit;

      const { count, rows } = await MonAn.findAndCountAll({
        where: {
          TinhTrang: {
            [Op.in]: filters.status,
          },
          DonGia: {
            [Op.between]: [filters.price.min, filters.price.max],
          },
        },
        limit,
        offset,
        order: [
          ['TenMonAn', filters.nameOrder],
          ['DonGia', filters.priceOrder],
        ],
      });

      return {
        total: count,
        data: rows,
      };
    } catch (error) {
      throw new Error(
        'Error fetching all mon an from database (service): ' + error.message
      );
    }
  },

  getMonAnById: async (id) => {
    try {
      return await MonAn.findOne({
        where: {
          MaMonAn: id,
        },
      });
    } catch (error) {
      throw new Error(
        'Error fetching mon an by id from database (service): ' + error.message
      );
    }
  },

  createMonAn: async (data) => {
    try {
      const existing = await MonAn.findOne({
        where: {
          TenMonAn: data.TenMonAn,
        },
      });

      if (existing) throw new Error('Mon an already exists');

      return await MonAn.create(data);
    } catch (error) {
      throw new Error(
        'Error creating mon an in database (service): ' + error.message
      );
    }
  },

  updateMonAn: async (id, data) => {
    try {
      const monan = await MonAn.findOne({
        where: {
          MaMonAn: id,
        },
      });
      if (!monan) throw new Error('Mon an not found');
      return await monan.update(data);
    } catch (error) {
      throw new Error(
        'Error updating mon an in database (service): ' + error.message
      );
    }
  },

  deleteMonAn: async (id) => {
    try {
      const monan = await MonAn.findOne({
        where: {
          MaMonAn: id,
        },
      });
      if (!monan) throw new Error('Mon an not found');
      return await monan.update({ TinhTrang: MonAnStatus.NO_LONGER_AVAILABLE });
    } catch (error) {
      throw new Error(
        'Error deleting mon an from database (service): ' + error.message
      );
    }
  },

  markAllMonAnAsDeleted: async () => {
    try {
      await MonAn.update(
        { TinhTrang: MonAnStatus.NO_LONGER_AVAILABLE },
        {
          where: {
            TinhTrang: {
              [Op.in]: [MonAnStatus.AVAILABLE, MonAnStatus.UNAVAILABLE],
            },
          },
        }
      );
    } catch (error) {
      throw new Error(
        'Error deleting all mon an from database (service): ' + error.message
      );
    }
  },

  // filters = {
  //   status: ['AVAILABLE', 'UNAVAILABLE', 'NO_LONGER_AVAILABLE'],
  //   price: { min: 0, max: 10000000, priceOrder: 'ASC' },
  //   nameOrder: 'ASC',
  // }
  searchMonAnByName: async (name, page, limit, filters) => {
    try {
      const offset = (page - 1) * limit;

      const whereClause = {
        [Op.and]: [
          {
            [Op.or]: [
              { MaMonAn: { [Op.like]: `%${name}%` } },
              { TenMonAn: { [Op.like]: `%${name}%` } },
            ],
          },
          {
            TinhTrang: {
              [Op.in]: filters.status,
            },
          },
          {
            DonGia: {
              [Op.between]: [filters.price.min, filters.price.max],
            },
          },
        ],
      };

      const { count, rows } = await MonAn.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [
          ['TenMonAn', filters.nameOrder],
          ['DonGia', filters.price.priceOrder],
        ],
      });

      return {
        data: rows,
        total: count,
      };
    } catch (error) {
      throw new Error(
        'Error searching mon an by name in database (service): ' + error.message
      );
    }
  },
};

module.exports = { MonAnService };
