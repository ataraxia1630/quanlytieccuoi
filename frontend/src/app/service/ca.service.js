const getAllCa = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
  }
  const response = await fetch('/api/ca', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch cas');
  return response.json();
};

const getCaById = async (maCa) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
  }
  const response = await fetch(`/api/ca/${maCa}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const text = await response.text();
    if (response.status === 404) throw new Error('Không tìm thấy ca');
    throw new Error(text || 'Failed to fetch ca');
  }
  return response.json();
};

const createCa = async (caData) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
  }
  const response = await fetch('/api/ca', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(caData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create ca');
  }
  return response.json();
};

const updateCa = async (maCa, caData) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
  }
  const response = await fetch(`/api/ca/${maCa}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(caData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update ca');
  }
  return response.json();
};

const deleteCa = async (maCa) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
  }
  const response = await fetch(`/api/ca/${maCa}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete ca');
  }
  return response.json();
};

const searchAndFilterCa = async (filters) => {
  try {
    const params = {};
    if (filters.maCa) params.maCa = filters.maCa;
    if (filters.tenCa) params.tenCa = filters.tenCa;
    if (filters.gioBatDau) params.gioBatDau = filters.gioBatDau;
    if (filters.gioKetThuc) params.gioKetThuc = filters.gioKetThuc;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;

    const query = new URLSearchParams(params).toString();
    console.log('Search query:', `/api/ca/search?${query}`); // Debug log
    const response = await fetch(`/api/ca/search?${query}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to search and filter cas');
    }
    return response.json();
  } catch (error) {
    if (
      error.message.includes('Failed to fetch') ||
      error.name === 'TypeError'
    ) {
      throw new Error(
        'Từ khóa tìm kiếm quá dài hoặc có lỗi kết nối, vui lòng thử lại'
      );
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
