import axiosClient from "./axiosClient";

const servicesApi = {
    async createService(serviceData) {
        try {
            const response = await axiosClient.post('services', serviceData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async updateService(id, serviceData) {
        try {
            const response = await axiosClient.put(`services/${id}`, serviceData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async deleteService(id) {
        try {
            const response = await axiosClient.delete(`services/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getServiceById(id) {
        try {
            const response = await axiosClient.get(`services/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getAllServices() {
        try {
            const response = await axiosClient.get('services');
            return response;
        } catch (error) {
            throw error;
        }
    },

    async searchServices(query) {
        try {
            const response = await axiosClient.get('services/search', { params: { query } });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getServicesByUserId(userId) {
        try {
            const response = await axiosClient.get(`services/user/${userId}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default servicesApi;
