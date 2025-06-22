import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/dichvu',
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

const DichVuService = {
  getAllDichVu: async (limit = 50, offset = 0) => {
    try {
      const response = await apiClient.get('/', { params: { limit, offset } });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Không thể lấy danh sách dịch vụ');
    }
  },

  getDichVuById: async (id) => {
    try {
      const response = await apiClient.get(`/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Không thể lấy thông tin dịch vụ');
    }
  },

  getActiveDichVu: async (limit = 50, offset = 0) => {
    try {
      const response = await apiClient.get('/active', {
        params: { limit, offset },
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Không thể lấy danh sách dịch vụ có sẵn');
    }
  },

  searchDichVu: async (searchParams = {}, limit = 50, offset = 0) => {
    try {
      const params = { ...searchParams, limit, offset };
      Object.keys(params).forEach((key) => {
        if (
          params[key] === '' ||
          params[key] === null ||
          params[key] === undefined
        ) {
          delete params[key];
        }
      });
      const response = await apiClient.get('/search', { params });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Không thể tìm kiếm dịch vụ');
    }
  },

  createDichVu: async (dichVuData) => {
    try {
      const response = await apiClient.post('/', dichVuData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Không thể tạo dịch vụ mới');
    }
  },

  updateDichVu: async (id, updateData) => {
    try {
      const response = await apiClient.put(`/${id}`, updateData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Không thể cập nhật dịch vụ');
    }
  },

  deleteDichVu: async (id) => {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Không thể xóa dịch vụ');
    }
  },
};

export default DichVuService;
