const db = require('../config/db');

const bookingController = {
    getAllBookings: async (req, res) => {
        try {
            const [rows] = await db.execute('SELECT * FROM bookings');
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getBookingById: async (req, res) => {
        try {
            const [rows] = await db.execute('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
            if (rows.length > 0) {
                res.json(rows[0]);
            } else {
                res.status(404).json({ message: 'Booking not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    createBooking: async (req, res) => {
        const { campground_id, user_id, start_date, end_date, total_price, quantity, payment_method, address, note, status } = req.body;
        try {
            await db.execute(`
                INSERT INTO bookings (campground_id, user_id, start_date, end_date, total_price, quantity, payment_method, address, note, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [campground_id, user_id, start_date, end_date, total_price, quantity, payment_method, address, note, status]);
            res.status(201).json({ message: 'Booking created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateBooking: async (req, res) => {
        const { campground_id, user_id, start_date, end_date, total_price, quantity, payment_method, status, address, note } = req.body;
        const bookingId = req.params.id;

        // Collect fields to update dynamically
        const fieldsToUpdate = [];
        const values = [];

        if (campground_id !== undefined) {
            fieldsToUpdate.push('campground_id = ?');
            values.push(campground_id);
        }
        if (user_id !== undefined) {
            fieldsToUpdate.push('user_id = ?');
            values.push(user_id);
        }
        if (start_date !== undefined) {
            fieldsToUpdate.push('start_date = ?');
            values.push(start_date);
        }
        if (end_date !== undefined) {
            fieldsToUpdate.push('end_date = ?');
            values.push(end_date);
        }
        if (total_price !== undefined) {
            fieldsToUpdate.push('total_price = ?');
            values.push(total_price);
        }
        if (quantity !== undefined) {
            fieldsToUpdate.push('quantity = ?');
            values.push(quantity);
        }
        if (payment_method !== undefined) {
            fieldsToUpdate.push('payment_method = ?');
            values.push(payment_method);
        }
        if (status !== undefined) {
            fieldsToUpdate.push('status = ?');
            values.push(status);
        }
        if (address !== undefined) {
            fieldsToUpdate.push('address = ?');
            values.push(address);
        }
        if (note !== undefined) {
            fieldsToUpdate.push('note = ?');
            values.push(note);
        }

        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        // Add booking ID to the values array
        values.push(bookingId);

        const updateQuery = `
            UPDATE bookings
            SET ${fieldsToUpdate.join(', ')}
            WHERE id = ?
        `;

        try {
            await db.execute(updateQuery, values);
            res.json({ message: 'Booking updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },


    deleteBooking: async (req, res) => {
        try {
            await db.execute('DELETE FROM bookings WHERE id = ?', [req.params.id]);
            res.json({ message: 'Booking deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getBookingsByUser: async (req, res) => {
        const userId = req.params.userId;
        try {
            const sql = `
                SELECT bookings.*, users.username AS user_name, campgrounds.name AS campground_name
                FROM bookings
                INNER JOIN users ON bookings.user_id = users.id
                INNER JOIN campgrounds ON bookings.campground_id = campgrounds.id
                WHERE bookings.user_id = ?
            `;
            const [rows] = await db.execute(sql, [userId]);
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getAllBookingsByUser: async (req, res) => {
        const userId = req.params.userId;

        try {
            // Lấy danh sách các campground_id mà người dùng hiện tại là chủ sân
            const [campgroundIds] = await db.execute('SELECT DISTINCT campground_id FROM bookings');

            // Duyệt qua từng campground_id
            const bookings = [];
            for (const { campground_id } of campgroundIds) {
                // Kiểm tra xem người dùng hiện tại có phải là chủ sân của campground_id này không
                const [campground] = await db.execute('SELECT * FROM campgrounds WHERE id = ? AND id_user = ?', [campground_id, userId]);
                if (campground.length > 0) {
                    const [campgroundBookings] = await db.execute(`
                    SELECT 
                        b.id AS booking_id,
                        b.campground_id,
                        b.user_id,
                        b.start_date,
                        b.end_date,
                        b.total_price,
                        b.quantity,
                        b.payment_method,
                        b.status,
                        b.address,
                        b.note,
                        u.username AS user_name,
                        u.phone AS user_phone,
                        c.name AS campground_name
                    FROM bookings b
                    JOIN users u ON b.user_id = u.id
                    JOIN campgrounds c ON b.campground_id = c.id
                    WHERE b.campground_id = ?
                `, [campground_id]);
                

                    bookings.push(...campgroundBookings);
                }
            }

            res.json(bookings);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

};

module.exports = bookingController;
