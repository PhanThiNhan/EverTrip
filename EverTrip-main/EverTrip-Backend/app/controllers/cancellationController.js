const db = require('../config/db');

const cancellationController = {
    getAllCancellations: async (req, res) => {
        try {
            const [rows] = await db.execute('SELECT * FROM cancellations');
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getCancellationById: async (req, res) => {
        try {
            const [rows] = await db.execute('SELECT * FROM cancellations WHERE id = ?', [req.params.id]);
            if (rows.length > 0) {
                res.json(rows[0]);
            } else {
                res.status(404).json({ message: 'Cancellation not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    createCancellation: async (req, res) => {
        const { booking_id, reason } = req.body;
        try {
            await db.execute('INSERT INTO cancellations (booking_id, reason) VALUES (?, ?)', [booking_id, reason]);
            res.status(201).json({ message: 'Cancellation created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateCancellation: async (req, res) => {
        const { reason } = req.body;
        try {
            await db.execute('UPDATE cancellations SET reason = ? WHERE id = ?', [reason, req.params.id]);
            res.json({ message: 'Cancellation updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteCancellation: async (req, res) => {
        try {
            await db.execute('DELETE FROM cancellations WHERE id = ?', [req.params.id]);
            res.json({ message: 'Cancellation deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    searchCancellations: async (req, res) => {
        const { query } = req.query;
        try {
            const [rows] = await db.execute('SELECT * FROM cancellations WHERE reason LIKE ?', [`%${query}%`]);
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = cancellationController;
