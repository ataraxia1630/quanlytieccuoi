import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api/dichvu",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const DichVuService = {
  getAllDichVu: async (limit = 10, offset = 0) => {
    try {
      const response = await apiClient.get("/", { params: { limit, offset } });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy danh sách dịch vụ"
      );
    }
  },

  getDichVuById: async (id) => {
    try {
      const response = await apiClient.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy thông tin dịch vụ"
      );
    }
  },

  getActiveDichVu: async (limit = 10, offset = 0) => {
    try {
      const response = await apiClient.get("/active", {
        params: { limit, offset },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Không thể lấy danh sách dịch vụ có sẵn"
      );
    }
  },

  searchDichVu: async (searchParams = {}, limit = 10, offset = 0) => {
    try {
      const params = { ...searchParams, limit, offset };
      Object.keys(params).forEach((key) => {
        if (
          params[key] === "" ||
          params[key] === null ||
          params[key] === undefined
        ) {
          delete params[key];
        }
      });
      const response = await apiClient.get("/search", { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể tìm kiếm dịch vụ"
      );
    }
  },

  createDichVu: async (dichVuData) => {
    try {
      const response = await apiClient.post("/", dichVuData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể tạo dịch vụ mới"
      );
    }
  },

  updateDichVu: async (id, updateData) => {
    try {
      const response = await apiClient.put(`/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể cập nhật dịch vụ"
      );
    }
  },

  deleteDichVu: async (id) => {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không thể xóa dịch vụ");
    }
  },
};

export default DichVuService;
