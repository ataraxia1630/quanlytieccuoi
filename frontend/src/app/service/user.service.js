const baseURL = '/api/user';
const token = localStorage.getItem('accessToken');

const UserService = {
  getAll: async (search = '') => {
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
      throw new Error(error.message || 'Không thể lấy danh sách người dùng!');
    }
    const result = await res.json();
    const users = result.users;
    const data = users.map((user) => ({
      username: user.username,
      TenNhom: user.NHOM.TenNhom,
    }));
    return data;
  },

  createNew: async (data) => {
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
      throw new Error(error.message || 'Không thể thêm người dùng!');
    }
    const result = await res.json();
    return result;
  },

  update: async (username, data) => {
    const res = await fetch(`${baseURL}/${username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể sửa người dùng!');
    }
    const result = await res.json();
    return result;
  },

  delete: async (username) => {
    const res = await fetch(`${baseURL}/${username}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Không thể xóa người dùng!');
    }
  },
};

export default UserService;
