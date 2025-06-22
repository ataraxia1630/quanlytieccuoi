const API_URL = "http://localhost:25053/api/danhsachtiec";
export const getHoaDon = async (id) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
    }

    const res = await fetch(`${API_URL}/hoadon/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Không thể lấy hóa đơn:", res.status, errorText);
      return null;
    }
    const data = await res.json();
    
    if (Array.isArray(data)) return data[data.length - 1]; 

    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API hóa đơn:", error);
    throw error;
  }
};


export const createHoaDon = async (data) => {
 try {
  const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
    }

  const res = await fetch(`${API_URL}/hoadon/create`, {
   method: "POST",
   headers: {
    "Content-Type" : "application/json",
      Authorization: `Bearer ${token}`,

   },
   body: JSON.stringify(data)
  })
  if(!res.ok) {
   throw new Error("Không thể tao hoa don");
  }
  return await res.json();
 } catch (error) {
  console.error("Lỗi khi tao hoa don:", error)
  throw error
 }
}
export const updateHoaDon = async (soHoaDon, data) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
    }

    const res = await fetch(`${API_URL}/hoadon/${soHoaDon}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
       },
      body: JSON.stringify(data),
    });

    const contentType = res.headers.get("content-type");

    if (!res.ok) {
      // Nếu là lỗi JSON, parse để lấy message cụ thể
      if (contentType && contentType.includes("application/json")) {
        const errJson = await res.json();
        throw new Error(errJson.message || "Cập nhật hoá đơn thất bại");
      }

      // Nếu không phải JSON, đọc text thường
      const errorText = await res.text();
      throw new Error(errorText || "Cập nhật hoá đơn thất bại");
    }

    return await res.json();
  } catch (error) {
    console.error("Lỗi cập nhật hoá đơn:", error);
    throw error;
  }
};

// services/hoadon.service.js
export const checkEditAllowed = async (soHoaDon) => {
  try {
    const res = await fetch(`${API_URL}/hoadon/check-date/${soHoaDon}`);
    const data = await res.json();

    if (!res.ok) {
      console.error("Lỗi từ backend:", data);
      throw new Error(data.message || "Không thể kiểm tra trạng thái chỉnh sửa hóa đơn");
    }

    return data.allowed;
  } catch (error) {
    console.error("checkEditAllowed error:", error);
    throw new Error("Không thể kiểm tra trạng thái chỉnh sửa hóa đơn");
  }
};
