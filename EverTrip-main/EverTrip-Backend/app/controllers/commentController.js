const db = require('../config/db');

const commentController = {
    getAllComments: async (req, res) => {
        try {
            const [rows] = await db.execute('SELECT * FROM comments');
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getCommentsByPostId: async (req, res) => {
        const postId = req.params.postId;
        try {
            const [rows] = await db.execute('SELECT * FROM comments WHERE post_id = ?', [postId]);
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    createComment: async (req, res) => {
        const { post_id, user_id, content } = req.body;
        try {
            await db.execute('INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)', [post_id, user_id, content]);
            res.status(201).json({ message: 'Comment created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateComment: async (req, res) => {
        const { content } = req.body;
        try {
            await db.execute('UPDATE comments SET content = ? WHERE id = ?', [content, req.params.id]);
            res.json({ message: 'Comment updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteComment: async (req, res) => {
        try {
            await db.execute('DELETE FROM comments WHERE id = ?', [req.params.id]);
            res.json({ message: 'Comment deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = commentController;
