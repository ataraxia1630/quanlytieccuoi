import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/thamso',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleApiError = (error, defaultMessage) => {
  if (error.response) {
    const { status, data } = error.response;
    if (status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
    } else if (status === 403) {
      throw new Error(
        'Bạn không có quyền thực hiện thao tác này. Vui lòng kiểm tra quyền truy cập hoặc đăng nhập lại.'
      );
    }
    throw new Error(data?.message || defaultMessage);
  }
  throw new Error(defaultMessage);
};

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại!');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const ThamSoService = {
  getAllThamSo: async (limit = 10, offset = 0, search = '') => {
    try {
      const response = await apiClient.get('/', {
        params: { limit, offset, search },
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Không thể lấy danh sách tham số');
    }
  },

  getThamSoByName: async (tenThamSo) => {
    try {
      const response = await apiClient.get(`/${tenThamSo}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Không thể lấy thông tin tham số');
    }
  },

  updateThamSo: async (tenThamSo, giaTri) => {
    try {
      const response = await apiClient.put(`/${tenThamSo}`, { GiaTri: giaTri });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Không thể cập nhật tham số');
    }
  },
};

export default ThamSoService;
