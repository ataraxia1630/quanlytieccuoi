import axios from 'axios';

const API_URL = '/api'; // Thay đổi URL API tùy theo backend của bạn

// Các hàm gọi API
export const getAllHalls = async (page, filters) => {
  try {
    const response = await axios.get(`${API_URL}/halls`, {
      params: {
        page,
        ...filters
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getHallById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/halls/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createHall = async (hallData) => {
  try {
    const response = await axios.post(`${API_URL}/halls`, hallData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateHall = async (id, hallData) => {
  try {
    const response = await axios.put(`${API_URL}/halls/${id}`, hallData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteHall = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/halls/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Hàm upload ảnh (nếu cần)
export const uploadHallImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axios.post(`${API_URL}/upload/hall-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};