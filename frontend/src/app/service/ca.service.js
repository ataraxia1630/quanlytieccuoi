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
    const text = await response.text();
    throw new Error(text || "Failed to create ca");
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
    const text = await response.text();
    if (response.status === 404) throw new Error("Không tìm thấy ca");
    throw new Error(text || "Failed to update ca");
  }
  return response.json();
};

const deleteCa = async (maCa) => {
  const response = await fetch(`/api/ca/${maCa}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const text = await response.text();
    if (response.status === 404) throw new Error("Không tìm thấy ca");
    throw new Error(text || "Failed to delete ca");
  }
  return response.json();
};

const getCaSchedule = async (startDate, endDate) => {
  const query = new URLSearchParams({ startDate, endDate }).toString();
  const response = await fetch(`/api/ca/schedule?${query}`);
  if (!response.ok) throw new Error("Failed to fetch ca schedule");
  return response.json();
};

const searchAndFilterCa = async (filters) => {
  const params = {};
  if (filters.maCa) params.maCa = filters.maCa;
  if (filters.tenCa) params.tenCa = filters.tenCa;
  if (filters.gioBatDau) {
    params.gioBatDauFrom = filters.gioBatDau;
    params.gioBatDauTo = filters.gioKetThuc || "";
    params.gioKetThucFrom = filters.gioBatDau;
    params.gioKetThucTo = filters.gioKetThuc || "";
  }
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;

  const query = new URLSearchParams(params).toString();
  console.log("Search query:", `/api/ca/search?${query}`); // Debug log
  const response = await fetch(`/api/ca/search?${query}`);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to search and filter cas");
  }
  return response.json();
};

const caService = {
  getAllCa,
  getCaById,
  createCa,
  updateCa,
  deleteCa,
  getCaSchedule,
  searchAndFilterCa,
};

export default caService;