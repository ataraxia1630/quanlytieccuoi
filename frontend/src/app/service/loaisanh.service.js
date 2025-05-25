const baseURL = 'http://localhost:25053/api/loaisanh';

const LoaiSanhService = {
  getAll: async (search = '', priceMin = 0, priceMax = 10000000) => {
    let uri = baseURL;
    const params = new URLSearchParams();

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
      throw new Error(error.message || 'Không thể lấy danh sách loại sảnh!');
    }
    const result = await res.json();
    return result;
  },

  getById: async (id) => {
    const res = await fetch(`${baseURL}/${id}`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể lấy thông tin loại sảnh!');
    }
    const data = await res.json();
    return data;
  },

  createNew: async (data) => {
    const res = await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể thêm loại sảnh!');
    }
    const result = await res.json();
    return result;
  },

  update: async (id, data) => {
    const res = await fetch(`${baseURL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể sửa loại sảnh!');
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
      throw new Error('Không thể xóa loại sảnh!');
    }
  },
};

export default LoaiSanhService;
