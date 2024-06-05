const db = require('../config/db');

const statsController = {
    getStats: async (req, res) => {
        try {
            const stats = {};

            // Đếm số lượng đặt khu cắm trại
            const [campgroundsCount] = await db.execute('SELECT COUNT(*) AS count FROM campgrounds');
            stats.campgroundsCount = campgroundsCount[0].count;

            // Tính tổng doanh thu từ đặt khu cắm trại
            const [campgroundsRevenue] = await db.execute('SELECT SUM(total_price) AS revenue FROM bookings');
            stats.campgroundsRevenue = campgroundsRevenue[0].revenue || 0;

            // Đếm số lượng dịch vụ
            const [servicesCount] = await db.execute('SELECT COUNT(*) AS count FROM services');
            stats.servicesCount = servicesCount[0].count;

            // Tính tổng doanh thu từ dịch vụ
            const [servicesRevenue] = await db.execute('SELECT SUM(price) AS revenue FROM services');
            stats.servicesRevenue = servicesRevenue[0].revenue || 0;

            res.json(stats);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getStatsByUserID: async (req, res) => {
        const { id_user } = req.params;

        try {
            const stats = {};

            // Đếm số lượng đặt khu cắm trại theo user ID
            const [campgroundsCount] = await db.execute('SELECT COUNT(*) AS count FROM campgrounds WHERE id_user = ?', [id_user]);
            stats.userCampgroundsCount = campgroundsCount[0].count;

            // Tính tổng doanh thu từ đặt khu cắm trại của user
            const [userCampgroundsRevenue] = await db.execute('SELECT SUM(total_price) AS revenue FROM bookings WHERE user_id = ?', [id_user]);
            stats.userCampgroundsRevenue = userCampgroundsRevenue[0].revenue || 0;

            // Đếm số lượng dịch vụ của user
            const [userServicesCount] = await db.execute('SELECT COUNT(*) AS count FROM services WHERE id_user = ?', [id_user]);
            stats.userServicesCount = userServicesCount[0].count;

            // Tính tổng doanh thu từ dịch vụ của user
            const [userServicesRevenue] = await db.execute('SELECT SUM(price) AS revenue FROM services WHERE id_user = ?', [id_user]);
            stats.userServicesRevenue = userServicesRevenue[0].revenue || 0;

            res.json(stats);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = statsController;
