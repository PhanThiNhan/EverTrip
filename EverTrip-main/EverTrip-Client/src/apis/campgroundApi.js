import axiosClient from "./axiosClient";

const campgroundApi = {
    async getAllCampgrounds() {
        try {
            const response = await axiosClient.get('/campground');
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getCampgroundById(id) {
        try {
            const response = await axiosClient.get(`/campground/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async createCampground(campgroundData) {
        try {
            const response = await axiosClient.post('/campground', campgroundData);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async updateCampground(id, campgroundData) {
        try {
            const response = await axiosClient.put(`/campground/${id}`, campgroundData);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async deleteCampground(id) {
        try {
            const response = await axiosClient.delete(`/campground/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async approveCampground(id) {
        try {
            const response = await axiosClient.put(`/campground/approve/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async denyCampground(id) {
        try {
            const response = await axiosClient.put(`/campground/deny/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchCampgrounds(query) {
        try {
            const response = await axiosClient.get('/campground/search', { params: { query } });
            return response;
        } catch (error) {
            throw error;
        }
    },
    async searchCampgroundsAdvanced({ location, max_guests, status }) {
        try {
            const response = await axiosClient.get('/campground/search/advanced', {
                params: { location, max_guests, status }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getCampgroundsByUserId(user_id) {
        try {
            const response = await axiosClient.get(`/campground/user/${user_id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getCampgroundsByUserCampgroundId(id) {
        try {
            const response = await axiosClient.get(`/campground/category/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default campgroundApi;
