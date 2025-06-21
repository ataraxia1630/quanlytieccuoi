const printCa = (caList) => {
  try {
    // Tạo HTML content cho việc in
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Danh Sách Ca</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            h1 {
              text-align: center;
              color: #063F5C;
              margin-bottom: 30px;
              font-size: 24px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px 8px;
              text-align: left;
            }
            th {
              background-color: #f8f9fa;
              font-weight: bold;
              color: #063F5C;
            }
            tr:nth-child(even) {
              background-color: #f8f9fa;
            }
            .text-center {
              text-align: center;
            }
            .footer {
              margin-top: 30px;
              text-align: right;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <h1>DANH SÁCH CA LÀM VIỆC</h1>
          <table>
            <thead>
              <tr>
                <th class="text-center">STT</th>
                <th class="text-center">Mã Ca</th>
                <th class="text-center">Tên Ca</th>
                <th class="text-center">Giờ Bắt Đầu</th>
                <th class="text-center">Giờ Kết Thúc</th>
              </tr>
            </thead>
            <tbody>
              ${caList
                .map(
                  (ca, index) => `
                <tr>
                  <td class="text-center">${index + 1}</td>
                  <td>${ca.MaCa}</td>
                  <td>${ca.TenCa}</td>
                  <td class="text-center">${ca.GioBatDau}</td>
                  <td class="text-center">${ca.GioKetThuc}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Ngày in: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}</p>
            <p>Tổng số ca: ${caList.length}</p>
          </div>
        </body>
      </html>
    `;    // Mở cửa sổ in mới
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      return {
        success: false,
        message: 'Không thể mở cửa sổ in. Vui lòng kiểm tra popup blocker.'
      };
    }
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Đợi nội dung được tải xong rồi mở hộp thoại in
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500); // Wait 500ms before showing print dialog
    };

    return {
      success: true,
      message: 'Mở cửa sổ in thành công'
    };
  } catch (error) {
    console.error('Error printing Ca:', error);
    return {
      success: false,
      message: error.message || 'Có lỗi xảy ra khi in'
    };
  }
};

export default printCa;
