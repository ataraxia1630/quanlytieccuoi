const { DichVuService, getDichVuById, createDichVu, updateDichVu } = require('../services/dichvu.service');

class customError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
	}
}

const parsePagination = (req) => {
	const limit = parseInt(req.query.limit) || 10;
	const offset = parseInt(req.query.offset) || 0;
	return { limit, offset };
};

const DichVuController = {
	getAllDichVu: async (req, res, next) => {
		try {
			const { limit, offset } = parsePagination(req);
			const data = await DichVuService.getAllDichVu(limit, offset);
			res.status(200).json(data);
		} catch (err) {
			next(err);
		}
	},

	getDichVuById: async (req, res, next) => {
		try {
			if (!req.params.id) {
				throw new customError('Invalid service ID.', 400);
			}
			const data = await DichVuService.getDichVuById(req.params.id);
			res.status(200).json(data);
		} catch (err) {
			next(err);
		}
	},

	createDichVu: async (req, res, next) => {
		try {
			const data = await DichVuService.createDichVu(req.body);
			res.status(201).json(data);
		} catch (err) {
			next(err);
		}
	},

	updateDichVu: async (req, res, next) => {
		try {
			if (!req.params.id) {
				throw new customError('Invalid service ID.', 400);
			}
			const updated = await DichVuService.updateDichVu(req.params.id, req.body);
			res.status(200).json({message: 'Service updated successfully.', updated });
		} catch (err) {
			next(err);
		}
	},

	deleteDichVu: async (req, res, next) => {
		try {
			if (!req.params.id) {
				throw new customError('Invalid service ID.', 400);
			}
			await DichVuService.deleteDichVu(req.params.id);
			res.status(200).json({ message: 'Service deleted successfully.' });
		} catch (err) {
			next(err);
		}
	},

	searchDichVu: async (req, res, next) => {
		try {
			const { limit, offset } = parsePagination(req);
			const { maDichVu, tenDichVu, giaTu, giaDen, tinhTrang } = req.query;

			const data = await DichVuService.searchDichVu({ maDichVu, tenDichVu, giaTu, giaDen, tinhTrang }, limit, offset);

			res.status(200).json(data);
		} catch (err) {
			next(err);
		}
	}
};

module.exports = DichVuController;