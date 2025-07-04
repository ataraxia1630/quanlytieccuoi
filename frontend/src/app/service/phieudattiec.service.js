import axios from 'axios';

const api = axios.create({
  baseURL: '/api/phieudattiec',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
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

// Hàm xử lý lỗi chung
const handleApiErrorForPDT = (error) => {
  if (error.response) {
    const { status } = error.response;
    if (status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
    } else if (status === 403) {
      throw new Error(
        'Bạn không có quyền thực hiện thao tác này. Vui lòng kiểm tra quyền truy cập hoặc đăng nhập lại.'
      );
    }
    throw new Error(error.response.data.message || 'Lỗi từ server');
  }
  throw new Error(error.message);
};

const PhieuDatTiecService = {
  getAllPhieuDatTiec: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      handleApiErrorForPDT(error);
    }
  },

  searchPhieuDatTiec: async (search) => {
    try {
      const response = await api.post('/search', search);
      return response.data;
    } catch (error) {
      handleApiErrorForPDT(error);
    }
  },

  getPhieuDatTiecById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      handleApiErrorForPDT(error);
    }
  },

  createPhieuDatTiec: async (data) => {
    try {
      const response = await api.post('/', data);
      return response.data;
    } catch (error) {
      handleApiErrorForPDT(error);
    }
  },

  updatePhieuDatTiec: async (id, data) => {
    try {
      const response = await api.put(`/${id}`, data);
      return response.data;
    } catch (error) {
      handleApiErrorForPDT(error);
    }
  },

  deletePhieuDatTiec: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      handleApiErrorForPDT(error);
    }
  },
};

export default PhieuDatTiecService;
