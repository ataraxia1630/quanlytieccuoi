const baseURL = '/api/permission';
const QuyenService = {
  getPerOfUser: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
      }
      let uri = baseURL;

      const res = await fetch(uri, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const error = await res.json();
        if (res.status === 401) {
          localStorage.removeItem('accessToken');
          throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
        }
        throw new Error(error.message || 'Không thể lấy danh sách quyền!');
      }
      const result = await res.json();
      return result.permissions;
    } catch (error) {
      throw new Error(
        error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'
      );
    }
  },

  getAll: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Có lỗi xảy ra. Vui lòng đăng nhập lại!');
      }
      let uri = baseURL + '/all';

      const res = await fetch(uri, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const error = await res.json();
        if (res.status === 401) {
          localStorage.removeItem('accessToken');
          throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
        }
        throw new Error(error.message || 'Không thể lấy danh sách quyền!');
      }
      const result = await res.json();
      return result.permissions;
    } catch (error) {
      throw new Error(
        error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'
      );
    }
  },
};

export default QuyenService;
