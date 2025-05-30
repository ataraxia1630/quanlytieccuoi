import axios from 'axios';
import { handleApiError } from './phieudattiec.service'

const api = axios.create({
    baseURL: '/api/ct-datban',
});


const getAllByPhieuDatTiecId = async (pdtId) => {
    try {
        const response = await api.get(`/${pdtId}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const getById = async (pdtId, monAnId) => {
    try {
        const response = await api.get(`/${pdtId}/${monAnId}`);
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

const update = async (pdtId, monAnId, data) => {
    try {
        const response = await api.put(`/${pdtId}/${monAnId}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const remove = async (pdtId, monAnId) => {
    try {
        const response = await api.delete(`/${pdtId}/${monAnId}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const ctDatBanService = {
    getAllByPhieuDatTiecId,
    getById,
    create,
    update,
    remove,
};

export default ctDatBanService;
