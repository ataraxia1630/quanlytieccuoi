const { sequelize } = require("../models/index.js");
const ApiError = require('../utils/apiError');
const { Op, literal } = require('sequelize');
const Ca = sequelize.models.Ca;
const PhieuDatTiec = sequelize.models.PhieuDatTiec;
const Sanh = sequelize.models.Sanh;
const LoaiSanh = sequelize.models.LoaiSanh;

// Helper function to check if two time ranges overlap
const timeRangesOverlap = (start1, end1, start2, end2) => {
    // Convert time strings to minutes since midnight
    const timeToMinutes = (timeStr) => {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        return hours * 60 + minutes + seconds / 60;
    };

    const s1 = timeToMinutes(start1);
    const e1 = timeToMinutes(end1);
    const s2 = timeToMinutes(start2);
    const e2 = timeToMinutes(end2);

    // Simple approach: normalize all times to a continuous timeline
    // If a range is overnight (end < start), we extend it to next day
    
    const ranges1 = [];
    const ranges2 = [];
    
    // Create all possible interpretations of range 1
    if (e1 >= s1) {
        // Same day range
        ranges1.push({ start: s1, end: e1 });
    } else {
        // Overnight range: split into two parts
        ranges1.push({ start: s1, end: 24 * 60 }); // Evening part
        ranges1.push({ start: 0, end: e1 });       // Morning part
    }
    
    // Create all possible interpretations of range 2
    if (e2 >= s2) {
        // Same day range
        ranges2.push({ start: s2, end: e2 });
    } else {
        // Overnight range: split into two parts
        ranges2.push({ start: s2, end: 24 * 60 }); // Evening part
        ranges2.push({ start: 0, end: e2 });       // Morning part
    }
      // Check if any part of range1 overlaps with any part of range2
    for (const r1 of ranges1) {
        for (const r2 of ranges2) {
            // Two ranges overlap if: start1 <= end2 AND start2 <= end1
            // Changed from < to <= to handle point-in-time cases (start = end)
            if (r1.start <= r2.end && r2.start <= r1.end) {
                return true;
            }
        }
    }
    
    return false;
};

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
        }        // Kiểm tra trùng lặp thời gian với các ca khác
        const allCas = await Ca.findAll({
            attributes: ['MaCa', 'TenCa', 'GioBatDau', 'GioKetThuc']
        });

        const overlappingCa = allCas.find(existingCa => 
            timeRangesOverlap(GioBatDau, GioKetThuc, existingCa.GioBatDau, existingCa.GioKetThuc)
        );

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
        }        // Kiểm tra trùng lặp thời gian với các ca khác (nếu có thay đổi thời gian)
        if (GioBatDau || GioKetThuc) {
            const allCas = await Ca.findAll({
                attributes: ['MaCa', 'TenCa', 'GioBatDau', 'GioKetThuc'],
                where: {
                    MaCa: { [Op.ne]: maCa } // Loại trừ ca hiện tại
                }
            });

            const overlappingCa = allCas.find(existingCa => 
                timeRangesOverlap(newGioBatDau, newGioKetThuc, existingCa.GioBatDau, existingCa.GioKetThuc)
            );

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

const searchAndFilterCa = async ({ maCa, tenCa, gioBatDau, gioKetThuc, sortBy, sortOrder }) => {
    try {
        const where = {};
        
        // Handle text search (maCa, tenCa)
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

        const order = sortBy && sortOrder ? [[sortBy, sortOrder]] : [['MaCa', 'ASC']];

        // Get all cas first
        let cas = await Ca.findAll({
            where,
            order
        });

        // Apply overlap filtering if time range is specified
        if (gioBatDau && gioKetThuc) {
            console.log('Applying overlap filter:', { gioBatDau, gioKetThuc });
            console.log('Total cas before filtering:', cas.length);
            
            cas = cas.filter(ca => {
                const caGioBatDau = ca.GioBatDau;
                const caGioKetThuc = ca.GioKetThuc;
                
                console.log(`\nChecking overlap: Filter(${gioBatDau} - ${gioKetThuc}) vs Ca "${ca.TenCa}"(${caGioBatDau} - ${caGioKetThuc})`);
                
                // Use the existing timeRangesOverlap helper function for overlap check
                const hasOverlap = timeRangesOverlap(gioBatDau, gioKetThuc, caGioBatDau, caGioKetThuc);
                
                console.log(`  Overlap result: ${hasOverlap}`);
                return hasOverlap;
            });
            
            console.log('Total cas after overlap filtering:', cas.length);
        }

        return cas;
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi tìm kiếm và lọc ca: ' + error.message);
    }
};

module.exports = { getAllCa, getCaById, createCa, updateCa, deleteCa, getCaSchedule, searchAndFilterCa };