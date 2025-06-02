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