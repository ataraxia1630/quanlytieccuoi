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
      const error = await res.text();
      throw new Error(error.message || 'Không thể đăng nhập!');
    }
    const token = await res.json();
    if (!token) {
      throw new Error('Đăng nhập không thành công!');
    }
    return token;
  },
};

export default AuthService;
