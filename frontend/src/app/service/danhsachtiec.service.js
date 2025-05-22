const API_URL = "http://localhost:25053/api/danhsachtiec";

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
export const postDanhSach = async (data) => {
  const response = await fetch('http://localhost:25053/api/danhsachtiec/filter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("Chi tiết lỗi:", result);
    throw new Error('Lỗi khi gọi API');
  }

  return result;
};

