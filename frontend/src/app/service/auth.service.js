const baseURL = '/api/auth';

const AuthService = {
  login: async (username, password) => {
    if (!username) throw new Error('Vui lòng nhập username!');
    if (!password) throw new Error('Vui lòng nhập password!');
    const uri = baseURL + '/login';
    const res = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Không thể đăng nhập!');
    }
    const result = await res.json();
    const token = result.token;
    if (!token) {
      throw new Error('Đăng nhập không thành công!');
    }
    return token;
  },

  changePassword: async (oldPassword, newPassword) => {
    const token = localStorage.getItem('accessToken');
    const uri = baseURL + '/change-password';
    const res = await fetch(uri, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    console.log({ oldPassword, newPassword });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(
        error.message || 'Đã có lỗi xảy ra! Vui lòng thử lại sau.'
      );
    }
    const result = await res.json();
    return result.message;
  },
};

export default AuthService;
