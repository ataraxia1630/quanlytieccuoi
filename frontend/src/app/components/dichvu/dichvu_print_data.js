import { toast } from 'react-toastify';

const printDichVu = (data, options = {}) => {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      toast.warning('Không có dữ liệu để in');
      return { success: false, message: 'Không có dữ liệu để in' };
    }

    const {
      title = 'DANH SÁCH DỊCH VỤ',
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

    const totalServices = data.length;
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
                  <th class="ma-col">Mã dịch vụ</th>
                  <th class="ten-col">Tên dịch vụ</th>
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
                    <td class="text-center">${item.MaDichVu || ''}</td>
                    <td class="text-left">${item.TenDichVu || ''}</td>
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
                    <td class="text-center">${item.TinhTrang || ''}</td>
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
                  <span class="summary-value">${totalServices.toLocaleString(
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
  } catch (err) {
    console.error('Print error:', err);
    return { success: false, message: err.message };
  }
};

export default printDichVu;
