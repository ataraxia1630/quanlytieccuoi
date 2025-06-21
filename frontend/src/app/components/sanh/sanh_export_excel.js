import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const exportSanhToExcel = async (data, fileName = 'DanhSachSanh') => {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Không có dữ liệu để xuất Excel');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Danh sách sảnh');

    // Merge cells for title
    worksheet.mergeCells('A1:F1');

    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'DANH SÁCH SẢNH TIỆC';
    titleCell.font = {
      name: 'Arial',
      size: 16,
      bold: true,
      color: { argb: '000000' },
    };
    titleCell.alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6F3FF' },
    };
    titleCell.border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' },
    };

    // Headers
    const headers = [
      'STT',
      'Mã sảnh',
      'Tên sảnh',
      'Loại sảnh',
      'Số lượng bàn tối đa',
      'Ghi chú',
    ];
    const headerRow = worksheet.getRow(3);

    headers.forEach((header, index) => {
      const cell = headerRow.getCell(index + 1);
      cell.value = header;
      cell.font = {
        name: 'Arial',
        size: 12,
        bold: true,
        color: { argb: 'FFFFFFFF' },
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Data rows
    data.forEach((item, index) => {
      const rowNumber = index + 4;
      const row = worksheet.getRow(rowNumber);

      // Màu nền xen kẽ
      const fillColor = index % 2 === 0 ? 'FFFFFFFF' : 'FFF8F9FA';

      // STT
      const sttCell = row.getCell(1);
      sttCell.value = index + 1;
      sttCell.alignment = { horizontal: 'center', vertical: 'middle' };
      sttCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillColor },
      };
      sttCell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };

      // Mã sảnh
      const maCell = row.getCell(2);
      maCell.value = item.MaSanh || '';
      maCell.alignment = { horizontal: 'center', vertical: 'middle' };
      maCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillColor },
      };
      maCell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };

      // Tên sảnh
      const tenCell = row.getCell(3);
      tenCell.value = item.TenSanh || '';
      tenCell.alignment = { horizontal: 'left', vertical: 'middle' };
      tenCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillColor },
      };
      tenCell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };

      // Loại sảnh
      const loaiSanhCell = row.getCell(4);
      loaiSanhCell.value = item.TenLoaiSanh || '';
      loaiSanhCell.alignment = { horizontal: 'left', vertical: 'middle' };
      loaiSanhCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillColor },
      };
      loaiSanhCell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };

      // Số lượng bàn tối đa
      const soLuongBanCell = row.getCell(5);
      soLuongBanCell.value = item.SoLuongBanToiDa || '';
      soLuongBanCell.alignment = { horizontal: 'center', vertical: 'middle' };
      soLuongBanCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillColor },
      };
      soLuongBanCell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };

      // Ghi chú
      const ghiChuCell = row.getCell(6);
      ghiChuCell.value = item.GhiChu || '';
      ghiChuCell.alignment = { horizontal: 'left', vertical: 'middle' };
      ghiChuCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillColor },
      };
      ghiChuCell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };
    });

    // Set column widths
    worksheet.columns = [
      { width: 8 }, // STT
      { width: 13 }, // Mã sảnh
      { width: 25 }, // Tên sảnh
      { width: 20 }, // Loại sảnh
      { width: 25 }, // Số lượng bàn tối đa
      { width: 30 }, // Ghi chú
    ];

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const timestamp = new Date().toISOString().split('T')[0];
    saveAs(blob, `${fileName}_${timestamp}.xlsx`);

    return { success: true, fileName: `${fileName}_${timestamp}.xlsx` };
  } catch (err) {
    console.error('Export Excel error:', err);
    return { success: false, message: err.message };
  }
};

export default exportSanhToExcel;
