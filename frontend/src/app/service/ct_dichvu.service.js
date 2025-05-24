import axios from 'axios';
import { handleApiError } from './phieudattiec.service'

const api = axios.create({
    baseURL: '/api/ct-dichvu',
});


const getAllByPhieuDatTiecId = async (pdtId) => {
    try {
        const response = await api.get(`/${pdtId}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const getById = async (pdtId, dichVuId) => {
    try {
        const response = await api.get(`/${pdtId}/${dichVuId}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const create = async (data) => {
    try {
        const response = await api.post('/', data);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const update = async (pdtId, dichVuId, data) => {
    try {
        const response = await api.put(`/${pdtId}/${dichVuId}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const remove = async (pdtId, dichVuId) => {
    try {
        const response = await api.delete(`/${pdtId}/${dichVuId}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const ctDichVuService = {
    getAllByPhieuDatTiecId,
    getById,
    create,
    update,
    remove,
};

export default ctDichVuService;
