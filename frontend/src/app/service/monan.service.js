import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { statusMapToFrontend } from '../pages/DanhSachMonAn/statusMapping';
const baseURL = '/api/monan';

const MonAnService = {
  getAll: async (
    status = [],
    search = '',
    priceMin = 0,
    priceMax = 10000000,
    page,
    limit,
    sort
  ) => {
    let uri = baseURL;
    const params = new URLSearchParams();

    if (status.length > 0) params.set('status', status.join(','));
    if (search) params.set('search', search);
    if (priceMin) params.set('minPrice', priceMin);
    if (priceMax) params.set('maxPrice', priceMax);
    if (page) params.set('page', page);
    if (limit) params.set('limit', limit);
    if (sort) params.set('sort', sort);

    const queryString = params.toString();
    if (queryString) {
      uri += `?${queryString}`;
    }

    const res = await fetch(uri);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể lấy danh sách món ăn!');
    }
    const result = await res.json();
    return result;
  },

  getAvailableMonAn: async () => {
    let uri = baseURL;

    const res = await fetch(uri);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(
        error.message || 'Không thể lấy danh sách món ăn có sẵn!'
      );
    }
    const result = await res.json();
    return result;
  },

  getById: async (id) => {
    const res = await fetch(`${baseURL}/${id}`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể lấy thông tin món ăn!');
    }
    const result = await res.json();
    return result;
  },

  createNew: async (data, file) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
    }
    const formData = new FormData();
    formData.append('TenMonAn', data.TenMonAn);
    formData.append('DonGia', data.DonGia);
    formData.append('TinhTrang', data.TinhTrang);
    if (file) formData.append('image', file);

    const res = await fetch(baseURL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể thêm món ăn!');
    }
    const result = await res.json();
    return result;
  },

  update: async (id, data, file) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
    }
    const formData = new FormData();
    formData.append('TenMonAn', data.TenMonAn);
    formData.append('DonGia', data.DonGia);
    formData.append('TinhTrang', data.TinhTrang);
    if (file) formData.append('image', file);

    const res = await fetch(`${baseURL}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể sửa món ăn!');
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
      const error = await res.json();
      throw new Error(error.message || 'Không thể xóa món ăn!');
    }
    return res.status === 204 ? '' : await res.json();
  },

  print: (data, options = {}) => {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        return { success: false, message: 'Không có dữ liệu để in' };
      }

      const {
        title = 'DANH SÁCH MÓN ĂN',
        showDate = true,
        showTotal = true,
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

      const totalMonAn = data.length;
      const totalValue = data.reduce((sum, item) => {
        const price =
          typeof item.DonGia === 'number'
            ? item.DonGia
            : parseFloat(item.DonGia) || 0;
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
            .ma-col { width: 15%; }
            .ten-col { width: 35%; }
            .gia-col { width: 20%; }
            .tinhtrang-col { width: 22%; }
            
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
                  <th class="ma-col">Mã món ăn</th>
                  <th class="ten-col">Tên món ăn</th>
                  <th class="gia-col">Đơn giá</th>
                  <th class="tinhtrang-col">Tình trạng</th>
                </tr>
              </thead>
              <tbody>
                ${data
                  .map(
                    (item, index) => `
                  <tr>
                    <td class="text-center">${index + 1}</td>
                    <td class="text-center">${item.MaMonAn || ''}</td>
                    <td class="text-left">${item.TenMonAn || ''}</td>
                    <td class="text-right">
                      ${
                        typeof item.DonGia === 'number' ||
                        !isNaN(parseFloat(item.DonGia))
                          ? formatCurrency(
                              typeof item.DonGia === 'number'
                                ? item.DonGia
                                : parseFloat(item.DonGia)
                            )
                          : item.DonGia || ''
                      }
                    </td>
                    <td class="text-center">${
                      statusMapToFrontend[item.TinhTrang] || ''
                    }</td>
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
                  <span class="summary-label">Tổng số dịch vụ:</span>
                  <span class="summary-value">${totalMonAn.toLocaleString(
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

  exportExcel: async (data, fileName = 'DanhSachMonAn') => {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Không có dữ liệu để xuất Excel');
      }
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Danh sách món ăn');

      worksheet.mergeCells('A1:E1');

      //#region title
      const titleCell = worksheet.getCell('A1');
      titleCell.value = 'DANH SÁCH MÓN ĂN';
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
        'Mã món ăn',
        'Tên món ăn',
        // 'Hình ảnh',
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
      //#endregion

      // const loadImage = async (url) => {
      //   try {
      //     const response = await fetch(url, { mode: 'cors' });
      //     if (!response.ok) throw new Error('Không thể tải hình ảnh');
      //     const blob = await response.blob();
      //     const arrayBuffer = await blob.arrayBuffer();
      //     return arrayBuffer;
      //   } catch (error) {
      //     console.error(`Lỗi tải hình ảnh từ ${url}:`, error);
      //     return null;
      //   }
      // };

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

        // Mã món ăn
        const maCell = row.getCell(2);
        maCell.value = item.MaMonAn || '';
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

        // Tên món ăn
        const tenCell = row.getCell(3);
        tenCell.value = item.TenMonAn || '';
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

        // // Hình ảnh
        // const hinhanhCell = row.getCell(4); // Định nghĩa hinhanhCell trước khi sử dụng
        // if (item.HinhAnh) {
        //   const imageBuffer = await loadImage(item.HinhAnh);
        //   if (imageBuffer) {
        //     const imageId = workbook.addImage({
        //       buffer: Buffer.from(imageBuffer),
        //       extension: 'png',
        //     });

        //     // Thêm hình ảnh vào ô
        //     worksheet.addImage(imageId, {
        //       tl: { col: 3, row: rowNumber - 1 }, // Cột D (4-1)
        //       ext: { width: 100, height: 100 }, // Kích thước hình ảnh
        //       editAs: 'oneCell', // Giữ hình ảnh trong ô
        //     });

        //     // Điều chỉnh chiều cao hàng
        //     row.height = 100 * 0.75; // Chuyển đổi pixel sang point (1 pixel ≈ 0.75 point)
        //   } else {
        //     hinhanhCell.value = 'Không tải được hình ảnh';
        //   }
        // } else {
        //   hinhanhCell.value = '';
        // }
        // hinhanhCell.alignment = { horizontal: 'center', vertical: 'middle' };
        // hinhanhCell.fill = {
        //   type: 'pattern',
        //   pattern: 'solid',
        //   fgColor: { argb: fillColor },
        // };
        // hinhanhCell.border = {
        //   top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        //   left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        //   bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        //   right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        // };

        // Đơn giá
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

        // Tình trạng
        const trangThaiCell = row.getCell(5);
        trangThaiCell.value = statusMapToFrontend[item.TinhTrang] || '';
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
      }
      //#endregion

      worksheet.columns = [
        { width: 8 }, // STT
        { width: 13 }, // Mã
        { width: 45 }, // Tên
        // { width: 35 }, // Hình ảnh
        { width: 18 }, // Đơn giá
        { width: 20 }, // Tình trạng
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

export default MonAnService;
