const { sequelize } = require("../models/index.js");
const { Op, literal } = require('sequelize');
const ApiError = require('../utils/apiError');
const imageService = require('./image.service');
const cloudinary = require('../config/cloudinaryConfig');

// Hàm trích xuất public_id từ URL ảnh của Cloudinary
const extractPublicIdFromUrl = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    const publicId = lastPart.split('.')[0]; // Lấy phần trước đuôi file (ví dụ: "sanh123" từ "sanh123.jpg")
    return publicId;
};

const Sanh = sequelize.models.Sanh;
const LoaiSanh = sequelize.models.LoaiSanh;
const PhieuDatTiec = sequelize.models.PhieuDatTiec;
const Ca = sequelize.models.Ca;

const getAllSanh = async () => {
    try {
        const sanhs = await Sanh.findAll({
            order: [['MaSanh', 'ASC']],
            include: [{ model: LoaiSanh, attributes: ['MaLoaiSanh', 'TenLoaiSanh'] }]
        });
        return sanhs;
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi lấy danh sách sảnh: ' + error.message);
    }
};

const getSanhById = async (maSanh) => {
    try {
        const sanh = await Sanh.findByPk(maSanh, {
            include: [{ model: LoaiSanh, attributes: ['MaLoaiSanh', 'TenLoaiSanh'] }]
        });
        return sanh;
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi lấy thông tin sảnh: ' + error.message);
    }
};

const generateMaSanh = async () => {
    try {
        const lastSanh = await Sanh.findOne({
            order: [['MaSanh', 'DESC']]
        });

        let nextId = 1;
        if (lastSanh) {
            const lastId = parseInt(lastSanh.MaSanh.replace('S', ''), 10);
            nextId = lastId + 1;
        }

        return `S${nextId.toString().padStart(3, '0')}`; // e.g., S001, S002
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi tạo mã sảnh: ' + error.message);
    }
};

const createSanh = async ({ MaLoaiSanh, TenSanh, SoLuongBanToiDa, fileBuffer, GhiChu }) => {
    try {
        const loaiSanh = await LoaiSanh.findByPk(MaLoaiSanh);
        if (!loaiSanh) {
            throw new ApiError(400, 'Mã loại sảnh không tồn tại');
        }

        // Kiểm tra tên sảnh đã tồn tại chưa
        const existingSanh = await Sanh.findOne({
            where: {
                TenSanh: TenSanh.trim()
            }
        });
        if (existingSanh) {
            throw new ApiError(400, `Tên sảnh "${TenSanh}" đã tồn tại`);
        }

        const MaSanh = await generateMaSanh(); // Auto-generate MaSanh

        let imageUrl = null;
        if (fileBuffer) {
            const imageResult = await imageService.uploadImage(fileBuffer);
            imageUrl = imageResult.url;
        }

        return await Sanh.create({
            MaSanh,
            MaLoaiSanh,
            TenSanh: TenSanh.trim(),
            SoLuongBanToiDa,
            HinhAnh: imageUrl,
            GhiChu
        });
    } catch (error) {
        if (error.name === 'ApiError') throw error;
        throw new ApiError(500, 'Lỗi khi thêm sảnh: ' + error.message);
    }
};

const updateSanh = async (maSanh, { MaLoaiSanh, TenSanh, SoLuongBanToiDa, fileBuffer, GhiChu }) => {
    try {
        const sanh = await Sanh.findByPk(maSanh);
        if (!sanh) {
            throw new ApiError(404, 'Không tìm thấy sảnh');
        }

        if (MaLoaiSanh) {
            const loaiSanh = await LoaiSanh.findByPk(MaLoaiSanh);
            if (!loaiSanh) {
                throw new ApiError(400, 'Mã loại sảnh không tồn tại');
            }
        }

        // Kiểm tra tên sảnh trùng lặp (nếu có thay đổi tên)
        if (TenSanh && TenSanh.trim() !== sanh.TenSanh) {
            const existingSanh = await Sanh.findOne({
                where: {
                    TenSanh: TenSanh.trim(),
                    MaSanh: {
                        [Op.ne]: maSanh // Loại bỏ chính sảnh đang cập nhật
                    }
                }
            });
            if (existingSanh) {
                throw new ApiError(400, `Tên sảnh "${TenSanh}" đã tồn tại`);
            }
        }

        let imageUrl = sanh.HinhAnh;
        if (fileBuffer) {
            // Xóa ảnh cũ trên Cloudinary nếu tồn tại
            if (sanh.HinhAnh) {
                const publicId = extractPublicIdFromUrl(sanh.HinhAnh);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            }
            const imageResult = await imageService.uploadImage(fileBuffer);
            imageUrl = imageResult.url;
        }

        await sanh.update({
            MaLoaiSanh: MaLoaiSanh || sanh.MaLoaiSanh,
            TenSanh: TenSanh ? TenSanh.trim() : sanh.TenSanh,
            SoLuongBanToiDa: SoLuongBanToiDa !== undefined ? SoLuongBanToiDa : sanh.SoLuongBanToiDa,
            HinhAnh: imageUrl,
            GhiChu: GhiChu !== undefined ? GhiChu : sanh.GhiChu
        });

        return true;
    } catch (error) {
        if (error.name === 'ApiError') throw error;
        throw new ApiError(500, 'Lỗi khi cập nhật sảnh: ' + error.message);
    }
};

const deleteSanh = async (maSanh) => {
    try {
        console.log("Received maSanh for delete:", maSanh); // Debug log
        const sanh = await Sanh.findByPk(maSanh);
        if (!sanh) {
            throw new ApiError(404, 'Không tìm thấy sảnh');
        }

        // Kiểm tra xem sảnh có đang được sử dụng trong phiếu đặt tiệc không
        const phieuDatTiecCount = await PhieuDatTiec.count({
            where: {
                MaSanh: maSanh,
            }
        });
        if (phieuDatTiecCount > 0) {
            throw new ApiError(400, `Không thể xóa sảnh "${sanh.TenSanh}" vì đang có ${phieuDatTiecCount} phiếu đặt tiệc sử dụng sảnh này.`);
        }

        // Xóa ảnh trên Cloudinary nếu tồn tại
        if (sanh.HinhAnh) {
            const publicId = extractPublicIdFromUrl(sanh.HinhAnh);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        await sanh.destroy();
        return true;
    } catch (error) {
        if (error.name === 'ApiError') throw error;
        throw new ApiError(500, error.message);
    }
};

const searchAndFilterSanh = async ({ maSanh, tenSanh, maLoaiSanh, minSoLuongBan, maxSoLuongBan, sortBy, sortOrder }) => {
    try {
        const where = {};
        if (maSanh || tenSanh) {
            where[Op.or] = [];
            if (maSanh) where[Op.or].push({ MaSanh: { [Op.like]: `%${maSanh}%` } });
            if (tenSanh) where[Op.or].push({ TenSanh: { [Op.like]: `%${tenSanh}%` } });
        }
        if (maLoaiSanh) where.MaLoaiSanh = maLoaiSanh;
        
        if (minSoLuongBan || maxSoLuongBan) {
            const minVal = minSoLuongBan ? parseInt(minSoLuongBan) : null;
            const maxVal = maxSoLuongBan ? parseInt(maxSoLuongBan) : null;
            
            // Kiểm tra logic min/max hợp lệ
            if (minVal && maxVal && minVal > maxVal) {
                throw new ApiError(400, 'Số lượng bàn tối thiểu không thể lớn hơn số lượng bàn tối đa');
            }
            
            where.SoLuongBanToiDa = {};
            if (minVal) where.SoLuongBanToiDa[Op.gte] = minVal;
            if (maxVal) where.SoLuongBanToiDa[Op.lte] = maxVal;
        }

        const order = sortBy && sortOrder ? [[sortBy, sortOrder]] : [['MaSanh', 'ASC']];

        const sanhs = await Sanh.findAll({
            where,
            order,
            include: [{ model: LoaiSanh, attributes: ['MaLoaiSanh', 'TenLoaiSanh'] }]
        });

        return sanhs;
    } catch (error) {
        if (error.name === 'ApiError') throw error;
        throw new ApiError(500, 'Lỗi khi tìm kiếm và lọc sảnh: ' + error.message);
    }
};


const uploadImage = async (maSanh, fileBuffer) => {
    try {
        console.log('Uploading image for MaSanh:', maSanh);
        console.log('File buffer received:', fileBuffer);

        const sanh = await Sanh.findByPk(maSanh);
        if (!sanh) {
            throw new ApiError(404, 'Không tìm thấy sảnh');
        }

        // Xóa ảnh cũ trên Cloudinary nếu tồn tại
        if (sanh.HinhAnh) {
            const publicId = extractPublicIdFromUrl(sanh.HinhAnh);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        // Upload ảnh mới lên Cloudinary
        const imageResult = await imageService.uploadImage(fileBuffer);
        const imageUrl = imageResult.url;

        // Cập nhật URL vào sảnh
        await sanh.update({ HinhAnh: imageUrl });

        return imageUrl;
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi upload ảnh: ' + error.message);
    }
};


const getSanhsAvailabilityByDate = async ({ ngayDaiTiec, soLuongBan, soBanDuTru }) => {
    try {
        // Chuyển đổi và kiểm tra đầu vào
        const parsedSoLuongBan = parseInt(soLuongBan) || 0;
        const parsedSoBanDuTru = parseInt(soBanDuTru) || 0;
        const totalBanRequired = parsedSoLuongBan + parsedSoBanDuTru;

        // Xây dựng điều kiện where cho sảnh
        const whereCondition = {};
        if (totalBanRequired > 0) {
            whereCondition.SoLuongBanToiDa = {
                [Op.gte]: totalBanRequired
            };
        }

        // Lấy tất cả sảnh
        const sanhs = await Sanh.findAll({
            where: whereCondition,
            include: [
                {
                    model: LoaiSanh,
                    attributes: ['MaLoaiSanh', 'TenLoaiSanh']
                },
                {
                    model: PhieuDatTiec,
                    include: [
                        {
                            model: Ca,
                            attributes: ['MaCa', 'TenCa', 'GioBatDau', 'GioKetThuc']
                        }
                    ],
                    where: {
                        NgayDaiTiec: {
                            [Op.between]: [
                                new Date(ngayDaiTiec + 'T00:00:00'),
                                new Date(ngayDaiTiec + 'T23:59:59')
                            ]
                        },
                        TrangThai: {
                            [Op.in]: ['Chưa thanh toán', 'Đã thanh toán']
                        }
                    },
                    required: false
                }
            ]
        });

        // Lấy tất cả các ca
        const allCas = await Ca.findAll();

        // Nếu không có sảnh nào, trả về mảng rỗng
        if (!sanhs || sanhs.length === 0) {
            return [];
        }

        // Lọc và xử lý kết quả theo từng ca
        const availability = sanhs.map(sanh => {
            const sanhData = sanh.toJSON();
            const bookedTickets = sanhData.PhieuDatTiecs || [];

            // Tính tình trạng theo từng ca
            const caAvailability = allCas.map(ca => {
                const caBooked = bookedTickets.find(ticket => ticket.MaCa === ca.MaCa);
                const isAvailable = !caBooked;

                return {
                    MaCa: ca.MaCa,
                    TrangThai: isAvailable ? 'Trống' : 'Không trống'
                };
            });

            // Thêm thuộc tính TenLoaiSanh và xóa LoaiSanh, PhieuDatTiecs
            sanhData.TenLoaiSanh = sanhData.LoaiSanh ? sanhData.LoaiSanh.TenLoaiSanh : null;
            delete sanhData.LoaiSanh;
            delete sanhData.PhieuDatTiecs;

            return {
                ...sanhData,
                CaAvailability: caAvailability
            };
        });
        console.log(availability)
        return availability;
    } catch (error) {
        throw new ApiError(500, 'Lỗi khi lấy danh sách sảnh khả dụng theo ca: ' + error.message);
    }
};
module.exports = { getSanhsAvailabilityByDate };

module.exports = {
    getAllSanh,
    getSanhById,
    searchAndFilterSanh,
    createSanh,
    updateSanh,
    deleteSanh,
    uploadImage,
    getSanhsAvailabilityByDate,
};