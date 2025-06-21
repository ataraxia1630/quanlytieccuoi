const API_URL = "http://localhost:25053/api/danhsachtiec";

export const getDanhSach = async ({ page = 1, limit = 10, sortField, sortOrder }) => {
  try {
    const offset = (page - 1) * limit;

    const params = new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString(),
    });

    if (sortField) params.append('sortField', sortField);
    if (sortOrder) params.append('sortOrder', sortOrder);

    const res = await fetch(`${API_URL}?${params.toString()}`);

    if (!res.ok) {
      throw new Error("Không thể lấy danh sách tiệc cưới");
    }

    return await res.json(); // { data, totalItems }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách:", error);
    throw error;
  }
};


export const postDanhSach = async (data, page = 1, limit = 10, sortField, sortOrder) => {
  const offset = (page - 1) * limit;

  const fullPayload = {
    ...data,
    offset,
    limit,
  };

  if (sortField) fullPayload.sortField = sortField;
  if (sortOrder) fullPayload.sortOrder = sortOrder;

  const response = await fetch(`${API_URL}/filter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fullPayload),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("Chi tiết lỗi:", result);
    throw new Error('Lỗi khi gọi API');
  }

  return result;
};



