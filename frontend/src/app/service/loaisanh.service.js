import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
const baseURL = '/api/loaisanh';

const LoaiSanhService = {
  getAll: async (search = '', priceMin = 0, priceMax = 10000000) => {
    let uri = baseURL;
    const params = new URLSearchParams();

    if (search) params.set('search', search);
    if (priceMin) params.set('minPrice', priceMin);
    if (priceMax) params.set('maxPrice', priceMax);

    const queryString = params.toString();
    if (queryString) {
      uri += `?${queryString}`;
    }

    const res = await fetch(uri);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể lấy danh sách loại sảnh!');
    }
    const result = await res.json();
    return result;
  },

  getById: async (id) => {
    const res = await fetch(`${baseURL}/${id}`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể lấy thông tin loại sảnh!');
    }
    const data = await res.json();
    return data;
  },

  createNew: async (data) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
    }
    const res = await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể thêm loại sảnh!');
    }
    const result = await res.json();
    return result;
  },

  update: async (id, data) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
    }
    const res = await fetch(`${baseURL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể sửa loại sảnh!');
    }
    const result = await res.json();
    return result;
  },

  delete: async (id) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
    }
    const res = await fetch(`${baseURL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Không thể xóa loại sảnh!');
    }
  },

  print: (data, options = {}) => {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        return { success: false, message: 'Không có dữ liệu để in' };
      }

      const {
        title = 'DANH SÁCH LOẠI SẢNH',
        showDate = true,
        showTotal = false,
        companyName = '',
        address = '',
      } = options;

      const currentDate = new Date().toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const totalLoaiSanh = data.length;
      const totalValue = data.reduce((sum, item) => {
        const price =
          typeof item.DonGiaBanToiThieu === 'number'
            ? item.DonGiaBanToiThieu
            : parseFloat(item.DonGiaBanToiThieu) || 0;
        return sum + price;
      }, 0);

      const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
      };

      const htmlContent = `
      <!DOCTYPE html>
      <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Times New Roman', serif;
              font-size: 12px;
              line-height: 1.4;
              color: #333;
              background: white;
              padding: 20px;
            }
            
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 15px;
            }
            
            .company-info {
              margin-bottom: 10px;
              font-size: 11px;
              color: #666;
            }
            
            .title {
              font-size: 20px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin: 15px 0;
            }
            
            .date-info {
              font-size: 11px;
              font-style: italic;
              color: #666;
            }
            
            .table-container {
              margin: 20px 0;
              overflow-x: auto;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              border: 2px solid #333;
              background: white;
            }
            
            th {
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              font-weight: bold;
              text-align: center;
              padding: 12px 8px;
              border: 1px solid #333;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            td {
              padding: 10px 8px;
              border: 1px solid #666;
              vertical-align: middle;
            }
            
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .text-left { text-align: left; }
            
            .stt-col { width: 8%; }
            .ma-col { width: 20%; }
            .ten-col { width: 30%; }
            .gia-col { width: 42%; }
            
            tbody tr:nth-child(even) {
              background-color: #f8f9fa;
            }
            
            tbody tr:hover {
              background-color: #e3f2fd;
            }
            
            .summary {
              margin-top: 30px;
              background: #ffffff;
              border: 2px solid #333;
              overflow: hidden;
            }
            
            .summary-header {
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              padding: 12px 20px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border-bottom: 1px solid #333;
            }
            
            .summary-content {
              padding: 20px;
            }
            
            .summary-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 0;
              font-size: 14px;
            }
            
            .summary-row:last-child {
              border-top: 1px solid #333;
              margin-top: 10px;
              padding-top: 15px;
              font-weight: bold;
              font-size: 15px;
            }
            
            .summary-label {
              font-weight: 500;
            }
            
            .summary-value {
              font-weight: bold;
              color: black;
              font-size: 15px;
            }
            
            .footer {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            
            .signature {
              text-align: center;
              min-width: 200px;
            }
            
            .signature-title {
              font-weight: bold;
              margin-bottom: 50px;
            }
            
            .signature-line {
              border-top: 1px solid #333;
              padding-top: 5px;
              font-style: italic;
            }
            
            @media print {
              body { 
                padding: 10px; 
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              .table-container { margin: 10px 0; }
              tbody tr:hover { background-color: transparent !important; }
              .summary {
                break-inside: avoid;
              }
            }
            
            @page {
              size: A4;
              margin: 1.1cm;
            }
          </style>
        </head>
        <body>
          <div class="header">
            ${
              companyName
                ? `<div class="company-info"><strong>${companyName}</strong></div>`
                : ''
            }
            ${address ? `<div class="company-info">${address}</div>` : ''}
            <h1 class="title">${title}</h1>
            ${
              showDate
                ? `<div class="date-info">Ngày in: ${currentDate}</div>`
                : ''
            }
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th class="stt-col">STT</th>
                  <th class="ma-col">Mã loại sảnh</th>
                  <th class="ten-col">Tên loại sảnh</th>
                  <th class="gia-col">Đơn giá bàn tối thiểu</th>
                </tr>
              </thead>
              <tbody>
                ${data
                  .map(
                    (item, index) => `
                  <tr>
                    <td class="text-center">${index + 1}</td>
                    <td class="text-center">${item.MaLoaiSanh || ''}</td>
                    <td class="text-center">${item.TenLoaiSanh || ''}</td>
                    <td class="text-right">
                      ${
                        typeof item.DonGiaBanToiThieu === 'number' ||
                        !isNaN(parseFloat(item.DonGiaBanToiThieu))
                          ? formatCurrency(
                              typeof item.DonGiaBanToiThieu === 'number'
                                ? item.DonGiaBanToiThieu
                                : parseFloat(item.DonGiaBanToiThieu)
                            )
                          : item.DonGiaBanToiThieu || ''
                      }
                    </td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>

          ${
            showTotal
              ? `
            <div class="summary">
              <div class="summary-header">
                Tổng kết
              </div>
              <div class="summary-content">
                <div class="summary-row">
                  <span class="summary-label">Tổng số loại sảnh:</span>
                  <span class="summary-value">${totalLoaiSanh.toLocaleString(
                    'vi-VN'
                  )} dịch vụ</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Tổng giá trị:</span>
                  <span class="summary-value">${formatCurrency(
                    totalValue
                  )}</span>
                </div>
              </div>
            </div>
          `
              : ''
          }

          <div class="footer">
            <div class="signature">
              <div class="signature-title">Người lập</div>
              <div class="signature-line">Ký tên</div>
            </div>
            <div class="signature">
              <div class="signature-title">Người duyệt</div>
              <div class="signature-line">Ký tên</div>
            </div>
          </div>
        </body>
      </html>
    `;

      const printWindow = window.open('', '_blank', 'width=800, height=600');
      if (!printWindow) {
        throw new Error(
          'Không thể mở cửa sổ in. Vui lòng kiểm tra popup blocker.'
        );
      }

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 100);
      };

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  exportExcel: async (data, fileName = 'DanhSachLoaiSanh') => {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Không có dữ liệu để xuất Excel');
      }
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Danh sách loại sảnh');

      worksheet.mergeCells('A1:D1');

      //#region title
      const titleCell = worksheet.getCell('A1');
      titleCell.value = 'DANH SÁCH LOẠI SẢNH';
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
      //#endregion

      //#region col header
      const headers = [
        'STT',
        'Mã loại sảnh',
        'Tên loại sảnh',
        'Đơn giá bàn tối thiểu(VNĐ)',
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
      //#endregion

      //#region data
      for (const [index, item] of data.entries()) {
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

        // Mã loại sảnh
        const maCell = row.getCell(2);
        maCell.value = item.MaLoaiSanh || '';
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

        // Tên loại sảnh
        const tenCell = row.getCell(3);
        tenCell.value = item.TenLoaiSanh || '';
        tenCell.alignment = { horizontal: 'center', vertical: 'middle' };
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

        // Đơn giá bàn tối thiểu
        const giaCell = row.getCell(4);
        let donGia = '';
        if (
          item.DonGiaBanToiThieu !== null &&
          item.DonGiaBanToiThieu !== undefined &&
          item.DonGiaBanToiThieu !== ''
        ) {
          const price =
            typeof item.DonGiaBanToiThieu === 'number'
              ? item.DonGiaBanToiThieu
              : parseFloat(item.DonGiaBanToiThieu);
          if (!isNaN(price)) {
            donGia = price.toLocaleString('vi-VN');
          } else {
            donGia = item.DonGiaBanToiThieu.toString();
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
      }
      //#endregion

      worksheet.columns = [
        { width: 8 }, // STT
        { width: 15 }, // Mã
        { width: 20 }, // Tên
        { width: 30 }, // Đơn giá
      ];

      // Xuất file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const timestamp = new Date().toISOString().split('T')[0];
      saveAs(blob, `${fileName}_${timestamp}.xlsx`);

      return { success: true };
    } catch (error) {
      console.error('Export Excel error:', error);
      return { success: false, message: error.message };
    }
  },
};

export default LoaiSanhService;
