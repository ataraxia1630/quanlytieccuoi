import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const exportDanhSachTiecCuoiToExcel = async (data, fileName = 'DanhSachTiecCuoi') => {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Không có dữ liệu để xuất Excel');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Danh sách tiệc cưới');

    worksheet.mergeCells('A1:I1');

    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'DANH SÁCH TIỆC CƯỚI';
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

    const headers = [
      'STT',
      'Số phiếu',
      'Tên chú rể',
      'Tên cô dâu',
      'Sảnh',
      'Số bàn',
      'Ngày',
      'Giờ',
      'Trạng thái',
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

    data.forEach((item, index) => {
      const rowNumber = index + 4;
      const row = worksheet.getRow(rowNumber);

      // Màu nền xen kẽ
      const fillColor = index % 2 === 0 ? 'FFFFFFFF' : 'FFF8F9FA';

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

      const date = new Date(item.NgayDaiTiec);
      const isValidDate = !isNaN(date);

      const formattedDate = isValidDate
        ? `${String(date.getDate()).padStart(2, '0')}/${String(
          date.getMonth() + 1
        ).padStart(2, '0')}/${date.getFullYear()}`
        : '';

      const formattedTime = isValidDate
        ? `${String(date.getHours()).padStart(2, '0')}:${String(
          date.getMinutes()
        ).padStart(2, '0')}`
        : '';


      const maCell = row.getCell(2);
      maCell.value = item.SoPhieuDatTiec || '';
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

      const tenchureCell = row.getCell(3);
      tenchureCell.value = item.TenChuRe || '';
      tenchureCell.alignment = { horizontal: 'left', vertical: 'middle' };
      tenchureCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillColor },
      };
      tenchureCell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };

      const tencodauCell = row.getCell(4);
      tencodauCell.value = item.TenCoDau || '';
      tencodauCell.alignment = { horizontal: 'left', vertical: 'middle' };
      tencodauCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillColor },
      };
      tencodauCell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };

      const tensanhCell = row.getCell(5);
      tensanhCell.value = item.Sanh.TenSanh || '';
      tensanhCell.alignment = { horizontal: 'left', vertical: 'middle' };
      tensanhCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillColor },
      };
      tensanhCell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };

      const slbanCell = row.getCell(6);
      slbanCell.value = item.SoLuongBan || '';
      slbanCell.alignment = { horizontal: 'left', vertical: 'middle' };
      slbanCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillColor },
      };
      slbanCell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };

      const ngayCell = row.getCell(7);
      ngayCell.value = formattedDate || '';
      ngayCell.alignment = { horizontal: 'left', vertical: 'middle' };
      ngayCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillColor },
      };
      ngayCell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };

      const gioCell = row.getCell(8);
      gioCell.value = formattedTime || '';
      gioCell.alignment = { horizontal: 'center', vertical: 'middle' };
      gioCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillColor },
      };
      gioCell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };

      const trangthaiCell = row.getCell(9);
      trangthaiCell.value = item.TrangThai || '';
      trangthaiCell.alignment = { horizontal: 'left', vertical: 'middle' };
      trangthaiCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillColor },
      };
      trangthaiCell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };

    })



    worksheet.columns = [
      { width: 8 }, // STT
      { width: 13 }, // Mã dịch vụ
      { width: 25 }, // Tên chu re
      { width: 25 }, // Tên co dau
      { width: 25 }, // Tên sanh
      { width: 13 }, // Số bàn
      { width: 13 }, // Ngày
      { width: 10 }, // Giờ
      { width: 20 }, // Trạng thái
    ];

    // Xuất file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const timestamp = new Date().toISOString().split('T')[0];
    saveAs(blob, `${fileName}_${timestamp}.xlsx`);

    return { success: true };
  } catch (err) {
    console.error('Export Excel error:', err);
    return { success: false, message: err.message };
  }
};

export default exportDanhSachTiecCuoiToExcel;
