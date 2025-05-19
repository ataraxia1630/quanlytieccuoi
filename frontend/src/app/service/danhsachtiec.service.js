const API_URL = "http://localhost:2025/danhsachtiec/";

export const getDanhSach = async () => {
 try {
  const res = await fetch(`${API_URL}`)
  if(!res.ok) {
   throw new Error("Không thể lấy danh sách tiệc cưới");
  }
  return await res.json();
 } catch (error) {
  console.error("Lỗi khi lấy danh sách:", error)
  throw error
 }
}