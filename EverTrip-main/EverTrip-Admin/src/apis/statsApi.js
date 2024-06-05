import axiosClient from "./axiosClient";

const statsApi = {
    async getStats() {
        try {
            const response = await axiosClient.get('stats');
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getStatsByUserId(userId) {
        try {
            const response = await axiosClient.get(`stats/${userId}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default statsApi;
