import { toast } from 'react-toastify';

const printSanh = (data, options = {}) => {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      toast.warning('Không có dữ liệu để in');
      return { success: false, message: 'Không có dữ liệu để in' };
    }

    const {
      title = 'DANH SÁCH SẢNH TIỆC',
      showDate = true,
      showTotal = true,
      companyName = 'QUẢN LÝ TIỆC CƯỚI',
      address = '',
    } = options;

    const currentDate = new Date().toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const totalSanhs = data.length;
    const totalCapacity = data.reduce((sum, item) => {
      const capacity = typeof item.SoLuongBanToiDa === 'number' 
        ? item.SoLuongBanToiDa 
        : parseFloat(item.SoLuongBanToiDa) || 0;
      return sum + capacity;
    }, 0);

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
            
            th, td {
              border: 1px solid #333;
              padding: 8px 6px;
              text-align: left;
              vertical-align: middle;
            }
            
            th {
              background-color: #f5f5f5;
              font-weight: bold;
              text-align: center;
              font-size: 11px;
              text-transform: uppercase;
            }
            
            td {
              font-size: 11px;
            }
            
            .text-center {
              text-align: center;
            }
            
            .text-right {
              text-align: right;
            }
            
            .summary {
              margin-top: 20px;
              padding: 15px;
              background-color: #f9f9f9;
              border: 1px solid #ddd;
              border-radius: 5px;
            }
            
            .summary-item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            
            .summary-label {
              font-weight: bold;
            }
            
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 10px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 15px;
            }
            
            @media print {
              body {
                padding: 10px;
                font-size: 11px;
              }
              
              .header {
                margin-bottom: 20px;
              }
              
              .title {
                font-size: 18px;
              }
              
              table {
                page-break-inside: auto;
              }
              
              tr {
                page-break-inside: avoid;
                page-break-after: auto;
              }
              
              .summary {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            ${companyName ? `<div class="company-info">${companyName}</div>` : ''}
            ${address ? `<div class="company-info">${address}</div>` : ''}
            <div class="title">${title}</div>
            ${showDate ? `<div class="date-info">Ngày in: ${currentDate}</div>` : ''}
          </div>
          
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th style="width: 8%;">STT</th>
                  <th style="width: 12%;">Mã sảnh</th>
                  <th style="width: 25%;">Tên sảnh</th>
                  <th style="width: 20%;">Loại sảnh</th>
                  <th style="width: 15%;">Số bàn tối đa</th>
                  <th style="width: 20%;">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                ${data.map((item, index) => `
                  <tr>
                    <td class="text-center">${index + 1}</td>
                    <td class="text-center">${item.MaSanh || ''}</td>
                    <td>${item.TenSanh || ''}</td>
                    <td>${item.LoaiSanh?.TenLoaiSanh || ''}</td>
                    <td class="text-center">${item.SoLuongBanToiDa || 0}</td>
                    <td>${item.GhiChu || ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          ${showTotal ? `
            <div class="summary">
              <div class="summary-item">
                <span class="summary-label">Tổng số sảnh:</span>
                <span>${totalSanhs}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Tổng sức chứa:</span>
                <span>${totalCapacity} bàn</span>
              </div>
            </div>
          ` : ''}
          
          <div class="footer">
            <p>Báo cáo được tạo tự động từ hệ thống quản lý tiệc cưới</p>
          </div>
        </body>
      </html>
    `;

    // Tạo cửa sổ in mới
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Không thể mở cửa sổ in. Vui lòng kiểm tra popup blocker.');
      return { success: false, message: 'Không thể mở cửa sổ in' };
    }

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Chờ DOM load xong rồi in
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      
      // Đóng cửa sổ sau khi in (tùy chọn)
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };

    toast.success('Đang chuẩn bị in danh sách sảnh...');
    return { success: true, message: 'In thành công' };

  } catch (error) {
    console.error('Lỗi khi in:', error);
    toast.error(`Lỗi khi in: ${error.message}`);
    return { success: false, message: error.message };
  }
};

export default printSanh;
