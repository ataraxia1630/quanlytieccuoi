const API_BASE_URL = 'http://localhost:3000/api'; // thay bằng địa chỉ backend thật sự nếu khác


// export const getAllDichVu = async (soPhieuDatTiec) => {
//   try {
//     const response = await fetch(`http://localhost:3000/api/ct-dichvu/${soPhieuDatTiec}`);
    
//     if (!response.ok) {
//       throw new Error('Không thể lấy dữ liệu từ server');
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Lỗi khi gọi API getAllDichVu:', error);
//     throw error;
//   }
// };
// export const getChiTietDichVu = async (soPhieuDatTiec, maDichVu) => {
//   try {
//     const response = await fetch(`http://localhost:3000/api/ct-dichvu/${soPhieuDatTiec}/${maDichVu}`);
    
//     if (!response.ok) {
//       throw new Error('Lỗi khi lấy danh sách chi tiết dịch vụ');
//     }

//     const data = await response.json();
//     return data; // data là mảng các chi tiết dịch vụ
//   } catch (error) {
//     console.error('Lỗi API:', error);
//     throw error;
//   }
// };
// frontend/services/ctDichVuService.js

export const getAllCTDichVuByPDTId = async (soPhieuDatTiec) => {
  try {
    const response = await fetch(`http://localhost:3000/api/ct-dichvu/${soPhieuDatTiec}`);
    if (!response.ok) {
      throw new Error('Không thể lấy danh sách chi tiết dịch vụ');
    }
    const data = await response.json();
    return data; // mảng chi tiết dịch vụ kèm tên dịch vụ nếu backend trả đủ
  } catch (error) {
    console.error('Lỗi khi gọi API:', error);
    throw error;
  }
};

export const getAllChiTietDichVu = async (soPhieuDatTiec, maDichVu = null) => {
  try {
    const url = maDichVu
      ? `http://localhost:3000/api/ct-dichvu/${soPhieuDatTiec}/${maDichVu}`
      : `http://localhost:3000/api/ct-dichvu/${soPhieuDatTiec}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Không thể lấy dữ liệu từ server');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi gọi API chi tiết dịch vụ:', error);
    throw error;
  }
};



// Thêm chi tiết dịch vụ
export async function createCTDichVu(data) {
  const response = await fetch(`${API_BASE_URL}/ct-dich-vu`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error('Không thể tạo chi tiết dịch vụ');
  return await response.json();
}

// Cập nhật chi tiết dịch vụ
export async function updateCTDichVu(maDichVu, soPhieuDatTiec, data) {
  const response = await fetch(`${API_BASE_URL}/ct-dich-vu/${soPhieuDatTiec}/${maDichVu}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error('Không thể cập nhật chi tiết dịch vụ');
  return await response.json();
}

// Xoá chi tiết dịch vụ
export async function deleteCTDichVu(maDichVu, soPhieuDatTiec) {
  const response = await fetch(`${API_BASE_URL}/ct-dich-vu/${soPhieuDatTiec}/${maDichVu}`, {
    method: 'DELETE'
  });

  if (!response.ok) throw new Error('Không thể xoá chi tiết dịch vụ');
  return await response.json();
}
