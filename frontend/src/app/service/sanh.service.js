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
  const response = await fetch("/api/sanh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sanhData),
  });
  if (!response.ok) throw new Error("Failed to create sanh");
  return response.json();
};

const updateSanh = async (maSanh, sanhData) => {
  const response = await fetch(`/api/sanh/${maSanh}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sanhData),
  });
  if (!response.ok) throw new Error("Failed to update sanh");
  return response.json();
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
  formData.append("file", file);  
  const response = await fetch(`/api/sanh/${maSanh}/upload-image`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to upload image");
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
};

export default sanhService;