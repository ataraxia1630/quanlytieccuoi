const baseURL = '/api/group';

const GroupService = {
  getAll: async (search = '') => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
    }
    let uri = baseURL + '/all';
    const params = new URLSearchParams();

    if (search) params.set('search', search);

    const queryString = params.toString();
    if (queryString) {
      uri += `?${queryString}`;
    }

    const res = await fetch(uri, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể lấy danh sách nhóm!');
    }
    const result = await res.json();
    return result.groups;
  },

  createNew: async (data) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
    }
    const res = await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể thêm nhóm!');
    }
    const result = await res.json();
    return result;
  },

  update: async (MaNhom, data) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
    }
    const res = await fetch(`${baseURL}/${MaNhom}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể sửa nhóm!');
    }
    const result = await res.json();
    return result;
  },

  delete: async (MaNhom) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
    }
    const res = await fetch(`${baseURL}/${MaNhom}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Không thể xóa nhóm!');
    }
  },
};

export default GroupService;
