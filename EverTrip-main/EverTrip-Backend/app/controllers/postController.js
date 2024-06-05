const db = require('../config/db');

const postController = {
    createPost: async (req, res) => {
        const { title, content, image, video, location, id_user } = req.body;
        try {
            await db.execute(`
                INSERT INTO posts (title, content, image, video, location, id_user)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [title, content, image, video, location, id_user]);
            res.status(201).json({ message: 'Post created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updatePost: async (req, res) => {
        const { id } = req.params;
        const { title, content, image, video, location, status } = req.body;
        try {
            const updateFields = [];
            const updateValues = [];
    
            if (title) {
                updateFields.push('title = ?');
                updateValues.push(title);
            }
            if (content) {
                updateFields.push('content = ?');
                updateValues.push(content);
            }
            if (image) {
                updateFields.push('image = ?');
                updateValues.push(image);
            }
            if (video) {
                updateFields.push('video = ?');
                updateValues.push(video);
            }
            if (location) {
                updateFields.push('location = ?');
                updateValues.push(location);
            }
            if (status) {
                updateFields.push('status = ?');
                updateValues.push(status);
            }
    
            if (updateFields.length === 0) {
                return res.status(400).json({ message: 'No fields to update' });
            }
    
            const updateQuery = `
                UPDATE posts
                SET ${updateFields.join(', ')}
                WHERE id = ?
            `;
            const updatedValues = [...updateValues, id];
    
            await db.execute(updateQuery, updatedValues);
            res.json({ message: 'Post updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    

    deletePost: async (req, res) => {
        const { id } = req.params;
        try {
            await db.execute('DELETE FROM posts WHERE id = ?', [id]);
            res.json({ message: 'Xóa bài viết thành công' });
        } catch (error) {
            console.error(error);
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                res.status(200).json({ message: 'Không thể xóa bài viết vì nó đang được tham chiếu bởi các bản ghi khác' });
            } else {
                res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
            }
        }
    },
    

    getPostById: async (req, res) => {
        const { id } = req.params;
        try {
            const [post] = await db.execute('SELECT * FROM posts WHERE id = ?', [id]);
            res.json(post);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getAllPosts: async (req, res) => {
        try {
            const [posts] = await db.execute('SELECT * FROM posts');
            res.json(posts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    searchPosts: async (req, res) => {
        const { query } = req.query;
        try {
            const [posts] = await db.execute('SELECT * FROM posts WHERE title LIKE ?', [`%${query}%`]);
            res.json(posts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    searchPostsByUser: async (req, res) => {
        const { query, id_users } = req.query;
        try {
            console.log(query, id_users);
            const [posts] = await db.execute(
                'SELECT * FROM posts WHERE title LIKE ? AND id_user = ?',
                [`%${query}%`, id_users]
            );
            res.json(posts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    addComment: async (req, res) => {
        const { content, id_user, id_post } = req.body;
        try {
            await db.execute(`
                INSERT INTO comments (content, id_user, id_post)
                VALUES (?, ?, ?)
            `, [content, id_user, id_post]);
            res.status(201).json({ message: 'Comment added successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getComments: async (req, res) => {
        const { id_post } = req.params;
        try {
            const [comments] = await db.execute(`
                SELECT comments.*, users.*
                FROM comments
                JOIN users ON comments.id_user = users.id
                WHERE comments.id_post = ?
            `, [id_post]);
            res.json(comments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
        }
    },    

    likePost: async (req, res) => {
        const { id_user, id_post } = req.body;
        try {
            await db.execute(`
                INSERT INTO likes (id_user, id_post)
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP
            `, [id_user, id_post]);
            res.json({ message: 'Post liked successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getLikes: async (req, res) => {
        const { id_post } = req.params;
        try {
            const [likes] = await db.execute('SELECT COUNT(*) AS like_count FROM likes WHERE id_post = ?', [id_post]);
            res.json(likes[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    

    approvePost: async (req, res) => {
        const { id } = req.params;
        try {
            await db.execute('UPDATE posts SET status = "approved" WHERE id = ?', [id]);
            res.json({ message: 'Post approved successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getPostsByUserId: async (req, res) => {
        const { user_id } = req.params;
        try {
            const [posts] = await db.execute('SELECT * FROM posts WHERE id_user = ?', [user_id]);
            res.json(posts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    denyPost: async (req, res) => {
        const { id } = req.params;
        try {
            await db.execute('UPDATE posts SET status = "denied" WHERE id = ?', [id]);
            res.json({ message: 'Post denied successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = postController;
