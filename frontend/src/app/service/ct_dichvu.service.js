const API_BASE_URL = 'http://localhost:3000/api'; // thay bằng địa chỉ backend thật sự nếu khác

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
