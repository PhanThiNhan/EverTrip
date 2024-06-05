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
    },

    async addComment(data) {
        try {
            const response = await axiosClient.post(`posts/comment`, data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getComments(postId) {
        try {
            const response = await axiosClient.get(`posts/comments/${postId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async likePost(data) {
        try {
            const response = await axiosClient.post(`posts/like`, data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getLikes(postId) {
        try {
            const response = await axiosClient.get(`posts/likes/${postId}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default postsApi;
