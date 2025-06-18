const getAllCa = async () => {
  const response = await fetch("/api/ca");
  if (!response.ok) throw new Error("Failed to fetch cas");
  return response.json();
};

const getCaById = async (maCa) => {
  const response = await fetch(`/api/ca/${maCa}`);
  if (!response.ok) {
    const text = await response.text();
    if (response.status === 404) throw new Error("Không tìm thấy ca");
    throw new Error(text || "Failed to fetch ca");
  }
  return response.json();
};

const createCa = async (caData) => {
  const response = await fetch("/api/ca", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(caData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create ca");
  }
  return response.json();
};

const updateCa = async (maCa, caData) => {
  const response = await fetch(`/api/ca/${maCa}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(caData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update ca");
  }
  return response.json();
};

const deleteCa = async (maCa) => {
  const response = await fetch(`/api/ca/${maCa}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete ca");
  }
  return response.json();
};

const searchAndFilterCa = async (filters) => {
  try {
    const params = {};
    if (filters.maCa) params.maCa = filters.maCa;
    if (filters.tenCa) params.tenCa = filters.tenCa;
    if (filters.gioBatDauFrom) params.gioBatDauFrom = filters.gioBatDauFrom;
    if (filters.gioBatDauTo) params.gioBatDauTo = filters.gioBatDauTo;
    if (filters.gioKetThucFrom) params.gioKetThucFrom = filters.gioKetThucFrom;
    if (filters.gioKetThucTo) params.gioKetThucTo = filters.gioKetThucTo;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;

    const query = new URLSearchParams(params).toString();
    console.log("Search query:", `/api/ca/search?${query}`); // Debug log
    const response = await fetch(`/api/ca/search?${query}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to search and filter cas");
    }
    return response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      throw new Error("Từ khóa tìm kiếm quá dài hoặc có lỗi kết nối, vui lòng thử lại");
    }
    throw error;
  }
};

const caService = {
  getAllCa,
  getCaById,
  createCa,
  updateCa,
  deleteCa,
  searchAndFilterCa,
};

export default caService;