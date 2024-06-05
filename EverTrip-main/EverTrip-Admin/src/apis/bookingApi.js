import axiosClient from "./axiosClient";

const bookingApi = {
    async getAllBookings() {
        try {
            const response = await axiosClient.get('bookings');
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getBookingById(id) {
        try {
            const response = await axiosClient.get(`bookings/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async createBooking(bookingData) {
        try {
            const response = await axiosClient.post('bookings', bookingData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async updateBooking(id, bookingData) {
        try {
            const response = await axiosClient.put(`bookings/${id}`, bookingData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async deleteBooking(id) {
        try {
            const response = await axiosClient.delete(`bookings/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getBookingsByUser(userId) {
        try {
            const response = await axiosClient.get(`bookings/user/${userId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getAllBookingsByUser(userId) {
        try {
            const response = await axiosClient.get(`bookings/bookings/byUser/${userId}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default bookingApi;
