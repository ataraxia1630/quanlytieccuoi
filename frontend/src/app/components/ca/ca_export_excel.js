import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const exportCaToExcel = async (data, fileName = 'DanhSachCa') => {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Không có dữ liệu để xuất Excel');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Danh sách ca');

    worksheet.mergeCells('A1:E1');

    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'DANH SÁCH CA';
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
      'Mã ca',
      'Tên ca',
      'Giờ bắt đầu',
      'Giờ kết thúc',
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

      const maCell = row.getCell(2);
      maCell.value = item.MaCa || '';
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

      const tenCell = row.getCell(3);
      tenCell.value = item.TenCa || '';
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

      const gioBatDauCell = row.getCell(4);
      gioBatDauCell.value = item.GioBatDau || '';
      gioBatDauCell.alignment = { horizontal: 'center', vertical: 'middle' };
      gioBatDauCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillColor },
      };
      gioBatDauCell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };

      const gioKetThucCell = row.getCell(5);
      gioKetThucCell.value = item.GioKetThuc || '';
      gioKetThucCell.alignment = { horizontal: 'center', vertical: 'middle' };
      gioKetThucCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillColor },
      };
      gioKetThucCell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };
    });

    worksheet.columns = [
      { width: 8 }, // STT
      { width: 13 }, // Mã ca
      { width: 35 }, // Tên ca
      { width: 15 }, // Giờ bắt đầu
      { width: 15 }, // Giờ kết thúc
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

export default exportCaToExcel;
