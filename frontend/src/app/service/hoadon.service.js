const API_URL = "http://localhost:25053/api/danhsachtiec";
export const getHoaDon = async (id) => {
 try {
  const res = await fetch(`${API_URL}/hoadon/${id}`)
  if(!res.ok) {
   console.log("Không thể lấy hoa don");
   return null
  }
  return await res.json();
 } catch (error) {
  console.error("Lỗi khi lấy hoa don:", error)
  throw error
 }
}

export const createHoaDon = async (id, data) => {
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