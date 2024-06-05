const db = require('../config/db');

const serviceController = {
    createService: async (req, res) => {
        const { name, description, image, price, operating_hours, location, quantity, id_user } = req.body;
        try {
            await db.execute(`
                INSERT INTO services (name, description, image, price, operating_hours, location, quantity, id_user)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [name, description, image, price, operating_hours, location, quantity, id_user]);
            res.status(201).json({ message: 'Service created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateService: async (req, res) => {
        const { id } = req.params;
        const { name, description, image, price, operating_hours, location, quantity } = req.body;
        try {
            await db.execute(`
                UPDATE services
                SET name = ?, description = ?, image = ?, price = ?, operating_hours = ?, location = ?, quantity = ?
                WHERE id = ?
            `, [name, description, image, price, operating_hours, location, quantity, id]);
            res.json({ message: 'Service updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteService: async (req, res) => {
        const { id } = req.params;
        try {
            await db.execute('DELETE FROM services WHERE id = ?', [id]);
            res.json({ message: 'Service deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getServiceById: async (req, res) => {
        const { id } = req.params;
        try {
            const [service] = await db.execute('SELECT * FROM services WHERE id = ?', [id]);
            res.json(service);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getAllServices: async (req, res) => {
        try {
            const [services] = await db.execute('SELECT * FROM services');
            res.json(services);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    searchServices: async (req, res) => {
        const { query } = req.query;
        try {
            const [services] = await db.execute('SELECT * FROM services WHERE name LIKE ?', [`%${query}%`]);
            res.json(services);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getServicesByUserId: async (req, res) => {
        const { id } = req.params;
        try {
            const [services] = await db.execute('SELECT * FROM services WHERE id_user = ?', [id]);
            res.json(services);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};

module.exports = serviceController;
