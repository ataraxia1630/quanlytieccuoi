import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const exportDichVuToExcel = async (data, fileName = 'DanhSachDichVu') => {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Không có dữ liệu để xuất Excel');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Danh sách dịch vụ');

    worksheet.mergeCells('A1:E1');

    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'DANH SÁCH DỊCH VỤ';
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
      'Mã dịch vụ',
      'Tên dịch vụ',
      'Đơn giá (VNĐ)',
      'Tình trạng',
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
      maCell.value = item.MaDichVu || '';
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
      tenCell.value = item.TenDichVu || '';
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

      // Xử lý định dạng tiền tệ
      const giaCell = row.getCell(4);
      let donGia = '';

      if (
        item.DonGia !== null &&
        item.DonGia !== undefined &&
        item.DonGia !== ''
      ) {
        const price =
          typeof item.DonGia === 'number'
            ? item.DonGia
            : parseFloat(item.DonGia);
        if (!isNaN(price)) {
          donGia = price.toLocaleString('vi-VN');
        } else {
          donGia = item.DonGia.toString();
        }
      }

      giaCell.value = donGia;
      giaCell.alignment = { horizontal: 'right', vertical: 'middle' };
      giaCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillColor },
      };
      giaCell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };

      const trangThaiCell = row.getCell(5);
      trangThaiCell.value = item.TinhTrang || '';
      trangThaiCell.alignment = { horizontal: 'center', vertical: 'middle' };
      trangThaiCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillColor },
      };
      trangThaiCell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };
    });

    worksheet.columns = [
      { width: 8 }, // STT
      { width: 13 }, // Mã dịch vụ
      { width: 35 }, // Tên dịch vụ
      { width: 18 }, // Đơn giá
      { width: 15 }, // Tình trạng
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

export default exportDichVuToExcel;
