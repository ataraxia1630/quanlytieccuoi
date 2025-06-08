const getAllSanh = async () => {
  const response = await fetch("/api/sanh");
  if (!response.ok) throw new Error("Failed to fetch sanhs");
  return response.json();
};

const searchAndFilterSanh = async (filters) => {
  const query = new URLSearchParams(filters).toString();
  const response = await fetch(`/api/sanh/search?${query}`);
  if (!response.ok) throw new Error("Failed to filter sanhs");
  return response.json();
};

const getSanhById = async (maSanh) => {
  const response = await fetch(`/api/sanh/${maSanh}`);
  if (!response.ok) throw new Error("Sanh not found");
  return response.json();
};

const createSanh = async (sanhData) => {
  const formData = new FormData();
  Object.keys(sanhData).forEach(key => {
    if (key === "HinhAnh" && sanhData[key] instanceof File) {
      formData.append("image", sanhData[key]);
    } else if (sanhData[key] !== undefined && sanhData[key] !== null) {
      formData.append(key, sanhData[key]);
    }
  });

  const response = await fetch("/api/sanh", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to create sanh");
  return response.json();
};

const updateSanh = async (maSanh, sanhData) => {
  console.log("updateSanh called with sanhData:", sanhData);
  console.log("HinhAnh type:", typeof sanhData.HinhAnh, "instanceof File:", sanhData.HinhAnh instanceof File);

  const formData = new FormData();
  Object.keys(sanhData).forEach(key => {
    console.log(`Processing key: ${key}, value:`, sanhData[key], `instanceof File: ${sanhData[key] instanceof File}`);
    if (key === "HinhAnh" && sanhData[key] instanceof File) {
      formData.append("image", sanhData[key]);
    } else if (sanhData[key] !== undefined && sanhData[key] !== null) {
      formData.append(key, sanhData[key]);
    }
  });

  const response = await fetch(`/api/sanh/${maSanh}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    console.log("Response error text:", text);
    throw new Error(text || "Failed to update sanh");
  }

  try {
    return await response.json();
  } catch {
    return {};
  }
};

const deleteSanh = async (maSanh) => {
  const response = await fetch(`/api/sanh/${maSanh}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete sanh");
  return response.json();
};

const uploadImage = async (maSanh, file) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await fetch(`/api/sanh/${maSanh}/upload-image`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to upload image: ${errorText || response.statusText}`);
  }
  return response.json();
};

const getAllLoaiSanh = async () => {
  const response = await fetch("/api/loaisanh");
  if (!response.ok) throw new Error("Failed to fetch loai sanhs");
  return response.json();
};

const getSanhsAvailabilityByDate = async (queryData) => {
  const query = new URLSearchParams(queryData).toString();
  const response = await fetch(`/api/sanh/availability?${query}`);
  if (!response.ok) {
    if (response.status === 400)
      throw new Error('Vui lòng cung cấp ngày đãi tiệc và số lượng bàn');
    else
      throw new Error("Failed to filter sanhs");
  }
  return response.json();
};

const sanhService = {
  getAllSanh,
  searchAndFilterSanh,
  getSanhById,
  createSanh,
  updateSanh,
  deleteSanh,
  uploadImage,
  getAllLoaiSanh,
  getSanhsAvailabilityByDate,
};

export default sanhService;