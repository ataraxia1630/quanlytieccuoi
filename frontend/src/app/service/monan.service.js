const baseURL = 'http://localhost:25053/api/monan';

const MonAnService = {
  getAll: async (
    status = [],
    search = '',
    priceMin = 0,
    priceMax = 10000000
  ) => {
    let uri = baseURL;
    const params = new URLSearchParams();

    if (status.length > 0) params.set('status', status.join(','));
    if (search) params.set('search', search);
    if (priceMin) params.set('minPrice', priceMin);
    if (priceMax) params.set('maxPrice', priceMax);

    const queryString = params.toString();
    if (queryString) {
      uri += `?${queryString}`;
    }

    const res = await fetch(uri);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể lấy danh sách món ăn!');
    }
    const result = await res.json();
    return result;
  },

  getAvailableMonAn: async () => {
    let uri = baseURL;

    const res = await fetch(uri);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể lấy danh sách món ăn có sẵn!');
    }
    const result = await res.json();
    return result;
  },

  getById: async (id) => {
    const res = await fetch(`${baseURL}/${id}`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể lấy thông tin món ăn!');
    }
    const result = await res.json();
    return result;
  },

  createNew: async (data, file) => {
    const formData = new FormData();
    formData.append('TenMonAn', data.TenMonAn);
    formData.append('DonGia', data.DonGia);
    formData.append('TinhTrang', data.TinhTrang);
    if (file) formData.append('image', file);

    const res = await fetch(baseURL, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể thêm món ăn!');
    }
    const result = await res.json();
    return result;
  },

  update: async (id, data, file) => {
    const formData = new FormData();
    formData.append('TenMonAn', data.TenMonAn);
    formData.append('DonGia', data.DonGia);
    formData.append('TinhTrang', data.TinhTrang);
    if (file) formData.append('image', file);

    const res = await fetch(`${baseURL}/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể sửa món ăn!');
    }
    const result = await res.json();
    return result;
  },

  delete: async (id) => {
    const res = await fetch(`${baseURL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể xóa món ăn!');
    }
    return res.status === 204 ? '' : await res.json();
  },
};

export default MonAnService;
