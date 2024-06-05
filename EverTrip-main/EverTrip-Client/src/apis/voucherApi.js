import axiosClient from "./axiosClient";

const voucherApi = {
    async createVoucher(voucherData) {
        try {
            const response = await axiosClient.post('voucher', voucherData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async updateVoucher(id, voucherData) {
        try {
            const response = await axiosClient.put(`voucher/${id}`, voucherData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async deleteVoucher(id) {
        try {
            const response = await axiosClient.delete(`voucher/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getVoucherById(id) {
        try {
            const response = await axiosClient.get(`voucher/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getAllvoucher() {
        try {
            const response = await axiosClient.get(`voucher`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async searchvoucher(query) {
        try {
            const response = await axiosClient.get('voucher/search', { params: { query } });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getVoucherByUserId(id_user) {
        try {
            const response = await axiosClient.get(`voucher/user/${id_user}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default voucherApi;
