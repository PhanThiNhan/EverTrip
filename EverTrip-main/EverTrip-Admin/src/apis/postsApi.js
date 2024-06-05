import axiosClient from "./axiosClient";

const postsApi = {
    async createPost(postData) {
        try {
            const response = await axiosClient.post('posts', postData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async updatePost(id, postData) {
        try {
            const response = await axiosClient.put(`posts/${id}`, postData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async deletePost(id) {
        try {
            const response = await axiosClient.delete(`posts/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getPostById(id) {
        try {
            const response = await axiosClient.get(`posts/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getAllPosts() {
        try {
            const response = await axiosClient.get('posts');
            return response;
        } catch (error) {
            throw error;
        }
    },

    async searchPosts(query) {
        try {
            const response = await axiosClient.get('posts/search', { params: { query } });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async searchPostsByUser(query, id_users ) {
        try {
            const response = await axiosClient.get('posts/searchByUser', { params: { query, id_users  } });
            return response;
        } catch (error) {
            throw error;
        }
    },

    async approvePost(id) {
        try {
            const response = await axiosClient.put(`posts/approve/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    
    async getPostsByUserId(userId) { // Bổ sung hàm lấy bài đăng theo user id
        try {
            const response = await axiosClient.get(`posts/user/${userId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    
    async denyPost(id) { // Bổ sung hàm từ chối bài đăng
        try {
            const response = await axiosClient.put(`posts/deny/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default postsApi;
