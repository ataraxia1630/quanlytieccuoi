const API_URL = "http://localhost:25053/api/danhsachtiec";
export const getHoaDon = async (id) => {
  try {
    const res = await fetch(`${API_URL}/hoadon/${id}`);
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
  const res = await fetch(`${API_URL}/hoadon/create`, {
   method: "POST",
   headers: {
    "Content-Type" : "application/json",
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
export const deleteHoaDon = async (soHoaDon) => {
  try {
    const res = await fetch(`${API_URL}/hoadon/${soHoaDon}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Không thể xoá hoá đơn:", res.status, errorText);
      throw new Error(errorText || "Xoá hoá đơn thất bại");
    }

    const data = await res.json();
    return data; 
  } catch (error) {
    console.error("Lỗi khi xoá hoá đơn:", error);
    throw error;
  }
};
export const restoreDichVu = async (soPhieu, dsBackup) => {
  try {
    const res = await fetch(`${API_URL}/hoadon/restore-dichvu/${soPhieu}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dsBackup),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Không thể khôi phục dịch vụ:", res.status, errorText);
      throw new Error(errorText || "Khôi phục dịch vụ thất bại");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi khôi phục dịch vụ:", error);
    throw error;
  }
};

