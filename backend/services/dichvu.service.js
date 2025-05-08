const { DichVu } = require('../models');
const { Op } = require('sequelize');

class customError extends Error {
  constructor(message, statusCode) {
	super(message);
	this.statusCode = statusCode;
  }
}

const DichVuService = {
  getAllDichVu: async (limit, offset) => {
		try {
	  	return await DichVu.findAll({ limit, offset });
		} catch (error) {
	  	throw new customError('Failed to fetch services.', 500);
		}
  },

  getDichVuById: async (id) => {
		try {
	  	const dichvu = await DichVu.findByPk(id);
	  	if (!dichvu) throw new customError('Service not found.', 404);
	  	return dichvu;
		} catch (err) {
			throw err.statusCode ? err : new customError('Error retreving service by ID.', 500);
		}
  },

  createDichVu: async (data) => {
		try {
			if ( !data.MaDichVu || !data.TenDichVu || !data.DonGia || !data.TinhTrang) {
				throw new customError('Missing required fields.', 400);
			}
			return await DichVu.create(data);
		} catch (err) {
			throw err.statusCode ? err : new customError('Error creating service.', 500);
		}
	},

	updateDichVu: async (id, data) => {
		try {
			if (!data || Object.keys(data).length === 0) {
				throw new customError('No data provided for update.', 400);
			}
		const [affectedRows] = await DichVu.update(data, { where: { MaDichVu: id } });
		if (affectedRows === 0) throw new customError('Service not found for update.', 404);
		return affectedRows;
		} catch (err) {
			throw err.statusCode ? err : new customError('Failed to update service.', 500);
		}
	},

	deleteDichVu: async (id) => {
		try {
			const deletedRows = await DichVu.destroy({ where: { MaDichVu: id } });
			if (deletedRows === 0) throw new customError('Service not found for deletion.', 404);
			return deletedRows;
		} catch (err) {
			throw err.statusCode ? err : new customError('Failed to delete service.', 500);
		}
	},

	searchDichVu: async (query, limit, offset) => {
		try {
			const { maDichVu, tenDichVu, giaTu, giaDen, tinhTrang } = query;
			const where = {};

			if (maDichVu) {
				where.MaDichVu = { [Op.like]: `%${maDichVu}%` };
			}

			if (tenDichVu) {
				where.TenDichVu = { [Op.like]: `%${tenDichVu}%` };
			}

			if (giaTu !== undefined && giaDen !== undefined) {
				if (isNaN(giaTu) || isNaN(giaDen)) {
					throw new customError('Invalid price range.', 400);
				}
				where.DonGia = { [Op.between]: [Number(giaTu), Number(giaDen)] };
			}

			if (tinhTrang) {
				where.TinhTrang = { [Op.like]: `%${tinhTrang}%` };
			}

			return await DichVu.findAll({ where, limit, offset });
		} catch (err) {
			throw err.statusCode ? err : new customError('Failed to search services.', 500);
		}
	}
};

module.exports = DichVuService;