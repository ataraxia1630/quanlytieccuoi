const API_URL = "http://localhost:25053/api/danhsachtiec";

export const getDanhSach = async ({ page = 1, limit = 10 }) => {
  try {
    const offset = (page - 1) * limit;
    const res = await fetch(`${API_URL}?offset=${offset}&limit=${limit}`);
    if (!res.ok) {
      throw new Error("Không thể lấy danh sách tiệc cưới");
    }
    return await res.json(); // cần trả dạng { data, totalItems }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách:", error);
    throw error;
  }
};

export const postDanhSach = async (data, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const response = await fetch(`${API_URL}/filter?offset=${offset}&limit=${limit}`, {
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


