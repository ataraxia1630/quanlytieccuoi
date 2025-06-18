const { sequelize } = require("../models/index.js");
const ApiError = require('../utils/apiError');
const { Op, literal } = require('sequelize');
const Ca = sequelize.models.Ca;
const PhieuDatTiec = sequelize.models.PhieuDatTiec;
const Sanh = sequelize.models.Sanh;
const LoaiSanh = sequelize.models.LoaiSanh;

const getAllCa = async () => {
    try {
        return await Ca.findAll({
            order: [['MaCa', 'ASC']]
        });
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi lấy danh sách ca: ' + error.message);
    }
};

const getCaById = async (maCa) => {
    try {
        const ca = await Ca.findByPk(maCa);
        return ca;
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi lấy thông tin ca: ' + error.message);
    }
};

const generateMaCa = async () => {
    try {
        const lastCa = await Ca.findOne({
            order: [['MaCa', 'DESC']]
        });

        let nextId = 1;
        if (lastCa) {
            const lastId = parseInt(lastCa.MaCa.replace('CA', ''), 10);
            nextId = lastId + 1;
        }

        return `CA${nextId.toString().padStart(3, '0')}`; // e.g., CA001, CA002
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi tạo mã ca: ' + error.message);
    }
};

const createCa = async ({ TenCa, GioBatDau, GioKetThuc }) => {
    try {
        // Validate giờ bắt đầu không được bằng giờ kết thúc
        if (GioBatDau === GioKetThuc) {
            throw new ApiError(400, 'Giờ bắt đầu không được bằng giờ kết thúc');
        }

        // Kiểm tra tên ca đã tồn tại chưa
        const existingCa = await Ca.findOne({
            where: {
                TenCa: TenCa.trim()
            }
        });
        if (existingCa) {
            throw new ApiError(400, `Tên ca "${TenCa}" đã tồn tại`);
        }

        // Kiểm tra trùng lặp thời gian với các ca khác
        const overlappingCa = await Ca.findOne({
            where: {
                [Op.or]: [
                    // Giờ bắt đầu của ca mới nằm trong khoảng thời gian của ca cũ
                    {
                        [Op.and]: [
                            { GioBatDau: { [Op.lte]: GioBatDau } },
                            { GioKetThuc: { [Op.gt]: GioBatDau } }
                        ]
                    },
                    // Giờ kết thúc của ca mới nằm trong khoảng thời gian của ca cũ
                    {
                        [Op.and]: [
                            { GioBatDau: { [Op.lt]: GioKetThuc } },
                            { GioKetThuc: { [Op.gte]: GioKetThuc } }
                        ]
                    },
                    // Ca mới bao phủ hoàn toàn ca cũ
                    {
                        [Op.and]: [
                            { GioBatDau: { [Op.gte]: GioBatDau } },
                            { GioKetThuc: { [Op.lte]: GioKetThuc } }
                        ]
                    }
                ]
            }
        });

        if (overlappingCa) {
            throw new ApiError(400, `Khoảng thời gian ${GioBatDau} - ${GioKetThuc} bị trùng với ca "${overlappingCa.TenCa}" (${overlappingCa.GioBatDau} - ${overlappingCa.GioKetThuc})`);
        }

        const MaCa = await generateMaCa(); // Auto-generate MaCa

        return await Ca.create({
            MaCa,
            TenCa: TenCa.trim(),
            GioBatDau,
            GioKetThuc
        });
    } catch (error) {
        if (error.name === 'ApiError') throw error;
        throw new ApiError(500, 'Lỗi khi thêm ca: ' + error.message);
    }
};

const updateCa = async (maCa, { TenCa, GioBatDau, GioKetThuc }) => {
    try {
        const ca = await Ca.findByPk(maCa);
        if (!ca) {
            throw new ApiError(404, 'Không tìm thấy ca');
        }

        // Validate giờ bắt đầu không được bằng giờ kết thúc (nếu có cập nhật)
        const newGioBatDau = GioBatDau || ca.GioBatDau;
        const newGioKetThuc = GioKetThuc || ca.GioKetThuc;
        
        if (newGioBatDau === newGioKetThuc) {
            throw new ApiError(400, 'Giờ bắt đầu không được bằng giờ kết thúc');
        }

        // Kiểm tra tên ca trùng lặp (nếu có thay đổi tên)
        if (TenCa && TenCa.trim() !== ca.TenCa) {
            const existingCa = await Ca.findOne({
                where: {
                    TenCa: TenCa.trim(),
                    MaCa: {
                        [Op.ne]: maCa
                    }
                }
            });
            if (existingCa) {
                throw new ApiError(400, `Tên ca "${TenCa}" đã tồn tại`);
            }
        }

        // Kiểm tra trùng lặp thời gian với các ca khác (nếu có thay đổi thời gian)
        if (GioBatDau || GioKetThuc) {
            const overlappingCa = await Ca.findOne({
                where: {
                    MaCa: { [Op.ne]: maCa }, // Loại trừ ca hiện tại
                    [Op.or]: [
                        // Giờ bắt đầu của ca được cập nhật nằm trong khoảng thời gian của ca khác
                        {
                            [Op.and]: [
                                { GioBatDau: { [Op.lte]: newGioBatDau } },
                                { GioKetThuc: { [Op.gt]: newGioBatDau } }
                            ]
                        },
                        // Giờ kết thúc của ca được cập nhật nằm trong khoảng thời gian của ca khác
                        {
                            [Op.and]: [
                                { GioBatDau: { [Op.lt]: newGioKetThuc } },
                                { GioKetThuc: { [Op.gte]: newGioKetThuc } }
                            ]
                        },
                        // Ca được cập nhật bao phủ hoàn toàn ca khác
                        {
                            [Op.and]: [
                                { GioBatDau: { [Op.gte]: newGioBatDau } },
                                { GioKetThuc: { [Op.lte]: newGioKetThuc } }
                            ]
                        }
                    ]
                }
            });

            if (overlappingCa) {
                throw new ApiError(400, `Khoảng thời gian ${newGioBatDau} - ${newGioKetThuc} bị trùng với ca "${overlappingCa.TenCa}" (${overlappingCa.GioBatDau} - ${overlappingCa.GioKetThuc})`);
            }
        }

        await ca.update({
            TenCa: TenCa ? TenCa.trim() : ca.TenCa,
            GioBatDau: GioBatDau || ca.GioBatDau,
            GioKetThuc: GioKetThuc || ca.GioKetThuc
        });
        return true;
    } catch (error) {
        if (error.name === 'ApiError') throw error;
        throw new ApiError(500, 'Lỗi khi cập nhật ca: ' + error.message);
    }
};

const deleteCa = async (maCa) => {
    try {
        const ca = await Ca.findByPk(maCa);
        if (!ca) {
            throw new ApiError(404, 'Không tìm thấy ca');
        }

        // Kiểm tra xem ca có đang được sử dụng trong phiếu đặt tiệc không
        const phieuDatTiecCount = await PhieuDatTiec.count({
            where: {
                MaCa: maCa,
                TrangThai: {
                    [Op.in]: ['Chưa thanh toán', 'Đã thanh toán'] // Chỉ kiểm tra phiếu còn hiệu lực
                }
            }
        });

        if (phieuDatTiecCount > 0) {
            throw new ApiError(400, `Không thể xóa ca "${ca.TenCa}" vì đang có ${phieuDatTiecCount} phiếu đặt tiệc sử dụng ca này.`);
        }

        await ca.destroy();
        return true;
    } catch (error) {
        if (error.name === 'ApiError') throw error;
        throw new ApiError(500, error.message);
    }
};

const getCaSchedule = async (startDate, endDate) => {
    try {
        const cas = await Ca.findAll({
            attributes: ['MaCa', 'TenCa'],
            order: [['MaCa', 'ASC']]
        });

        const phieuDatTiecs = await PhieuDatTiec.findAll({
            where: {
                NgayDaiTiec: {
                    [Op.between]: [startDate, endDate]
                },
                TrangThai: true
            },
            include: [
                {
                    model: Sanh,
                    attributes: ['MaSanh', 'TenSanh', 'MaLoaiSanh'],
                    include: [
                        {
                            model: LoaiSanh,
                            attributes: ['TenLoaiSanh']
                        }
                    ]
                },
                {
                    model: Ca,
                    attributes: ['MaCa', 'TenCa']
                }
            ]
        });

        const days = [];
        let currentDate = new Date(startDate);
        const end = new Date(endDate);
        const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

        while (currentDate <= end) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayOfWeek = dayNames[currentDate.getDay()];
            const bookings = cas.map(ca => ({
                MaCa: ca.MaCa,
                TenCa: ca.TenCa,
                tiec: phieuDatTiecs
                    .filter(pdt => pdt.NgayDaiTiec.toISOString().split('T')[0] === dateStr && pdt.MaCa === ca.MaCa)
                    .map(pdt => ({
                        SoPhieuDatTiec: pdt.SoPhieuDatTiec,
                        MaSanh: pdt.Sanh.MaSanh,
                        TenSanh: pdt.Sanh.TenSanh,
                        TenLoaiSanh: pdt.Sanh.LoaiSanh.TenLoaiSanh,
                        TenChuRe: pdt.TenChuRe,
                        TenCoDau: pdt.TenCoDau,
                        SDT: pdt.SDT
                    }))
            }));

            days.push({
                date: dateStr,
                dayOfWeek: dayOfWeek,
                bookings
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return {
            startDate,
            endDate,
            schedule: days
        };
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi lấy lịch ca: ' + error.message);
    }
};

const searchAndFilterCa = async ({ maCa, tenCa, gioBatDauFrom, gioBatDauTo, gioKetThucFrom, gioKetThucTo, sortBy, sortOrder }) => {
    try {
        const where = {};
        if (maCa || tenCa) {
        const orConditions = [];
        if (maCa) {
            orConditions.push({ MaCa: { [Op.like]: `%${maCa}%` } });
        }
        if (tenCa) {
            orConditions.push({ TenCa: { [Op.like]: `%${tenCa}%` } });
        }
        where[Op.or] = orConditions;
    }

        const conditions = [];
        if (gioBatDauFrom) conditions.push(literal(`GioBatDau >= '${gioBatDauFrom}'`));
        if (gioBatDauTo) conditions.push(literal(`GioBatDau <= '${gioBatDauTo}'`));
        if (gioKetThucFrom) conditions.push(literal(`GioKetThuc >= '${gioKetThucFrom}'`));
        if (gioKetThucTo) conditions.push(literal(`GioKetThuc <= '${gioKetThucTo}'`));

        if (conditions.length > 0) {
            where[Op.and] = conditions;
        }

        const order = sortBy && sortOrder ? [[sortBy, sortOrder]] : [['MaCa', 'ASC']];

        const cas = await Ca.findAll({
            where,
            order
        });

        return cas;
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi tìm kiếm và lọc ca: ' + error.message);
    }
};

module.exports = { getAllCa, getCaById, createCa, updateCa, deleteCa, getCaSchedule, searchAndFilterCa };