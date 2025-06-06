import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/thamso',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const ThamSoService = {
  getAllThamSo: async (limit = 10, offset = 0, search = '') => {
    try {
      const response = await apiClient.get('/', {
        params: { limit, offset, search },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Không thể lấy danh sách tham số'
      );
    }
  },

  getThamSoByName: async (tenThamSo) => {
    try {
      const response = await apiClient.get(`/${tenThamSo}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Không thể lấy thông tin tham số'
      );
    }
  },

  updateThamSo: async (tenThamSo, giaTri) => {
    try {
      const response = await apiClient.put(`/${tenThamSo}`, { GiaTri: giaTri });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Không thể cập nhật tham số'
      );
    }
  },
};

export default ThamSoService;
