const db = require('../config/db');

const voucherController = {
    createVoucher: async (req, res) => {
        const { voucher_code, discount_rate, voucher_type, description, expiry_date, quantity, max_discount, id_user } = req.body;
        try {
            await db.execute(`
                INSERT INTO vouchers (voucher_code, discount_rate, voucher_type, description, expiry_date, quantity, max_discount, id_user)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [voucher_code, discount_rate, voucher_type, description, expiry_date, quantity, max_discount, id_user]);
            res.status(201).json({ message: 'Voucher created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateVoucher: async (req, res) => {
        const { id } = req.params;
        const { voucher_code, discount_rate, voucher_type, description, expiry_date, quantity, max_discount } = req.body;
        try {
            await db.execute(`
                UPDATE vouchers
                SET voucher_code = ?, discount_rate = ?, voucher_type = ?, description = ?, expiry_date = ?, quantity = ?, max_discount = ?
                WHERE id = ?
            `, [voucher_code, discount_rate, voucher_type, description, expiry_date, quantity, max_discount, id]);
            res.json({ message: 'Voucher updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteVoucher: async (req, res) => {
        const { id } = req.params;
        try {
            await db.execute('DELETE FROM vouchers WHERE id = ?', [id]);
            res.json({ message: 'Voucher deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getVoucherById: async (req, res) => {
        const { id } = req.params;
        try {
            const [voucher] = await db.execute('SELECT * FROM vouchers WHERE id = ?', [id]);
            res.json(voucher);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getAllVouchers: async (req, res) => {
        try {
            const [vouchers] = await db.execute('SELECT * FROM vouchers');
            res.json(vouchers);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    searchVouchers: async (req, res) => {
        const { query } = req.query;
        try {
            const [vouchers] = await db.execute('SELECT * FROM vouchers WHERE voucher_code LIKE ?', [`%${query}%`]);
            res.json(vouchers);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    
    getVoucherByUserId: async (req, res) => {
        const { id_user } = req.params;
        try {
            const [vouchers] = await db.execute('SELECT * FROM vouchers WHERE id_user = ?', [id_user]);
            res.json(vouchers);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    searchVouchersByUser: async (req, res) => {
        const { query, id_users } = req.query;
        try {
            const [vouchers] = await db.execute(
                'SELECT * FROM vouchers WHERE voucher_code LIKE ? AND id_user = ?',
                [`%${query}%`, id_users]
            );
            res.json(vouchers);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    
};

module.exports = voucherController;
