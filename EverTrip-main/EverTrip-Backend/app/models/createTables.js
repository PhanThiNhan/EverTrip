const db = require('../config/db');

const createTables = async () => {
    try {
        // Tạo bảng "users" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(255),
                username VARCHAR(255),
                password VARCHAR(255) NOT NULL,
                role VARCHAR(255),
                status VARCHAR(255) DEFAULT 'noactive',
                image VARCHAR(255) DEFAULT 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('Table "users" created or already exists.');

        // Tạo bảng "password_reset_tokens" nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            token VARCHAR(255) NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
        `);

        console.log('Table "password_reset_tokens" created or already exists.');

        // Tạo bảng "campgrounds" nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS campgrounds (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            address VARCHAR(255),
            description TEXT,
            image VARCHAR(255),
            amenities TEXT,
            price DECIMAL(10, 2),
            gps_location VARCHAR(255),
            regulations TEXT,
            policies TEXT,
            max_guests INT,
            id_user INT,
            status VARCHAR(255) DEFAULT 'pending',
            FOREIGN KEY (id_user) REFERENCES users(id)
        )
        `);

        console.log('Table "campgrounds" created or already exists.');

        // Tạo bảng "posts" nếu chưa tồn tại
        await db.execute(`
          CREATE TABLE IF NOT EXISTS posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT,
            image VARCHAR(255),
            video VARCHAR(255),
            location VARCHAR(255),
            status ENUM('pending', 'approved', 'denied') DEFAULT 'pending',
            id_user INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (id_user) REFERENCES users(id)
        )
          `);

        console.log('Table "posts" created or already exists.');

        // Tạo bảng "services" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS services  (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                image VARCHAR(255),
                price DECIMAL(10, 2),
                operating_hours VARCHAR(255),
                location VARCHAR(255),
                quantity INT,
                id_user INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (id_user) REFERENCES users(id)
                        )
            `);

        console.log('Table "services" created or already exists.');

        // Tạo bảng "vouchers" nếu chưa tồn tại
        await db.execute(`
                CREATE TABLE IF NOT EXISTS vouchers  (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    voucher_code VARCHAR(255) NOT NULL,
                    discount_rate DECIMAL(10, 2),
                    voucher_type VARCHAR(255),
                    description TEXT,
                    expiry_date DATE,
                    quantity INT,
                    max_discount DECIMAL(10, 2),
                    id_user INT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (id_user) REFERENCES users(id)
                )
                `);

        console.log('Table "vouchers" created or already exists.');

        // Tạo bảng "bookings" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                campground_id INT,
                user_id INT,
                start_date DATE,
                end_date DATE,
                total_price DECIMAL(10, 2),
                quantity INT,
                payment_method VARCHAR(50),
                payment_status VARCHAR(50) DEFAULT 'pending',
                FOREIGN KEY (campground_id) REFERENCES campgrounds(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
            `);

                    console.log('Table "bookings" created or already exists.');


        // Tạo bảng "cancellations" nếu chưa tồn tại
        await db.execute(`
         CREATE TABLE IF NOT EXISTS cancellations (
             id INT AUTO_INCREMENT PRIMARY KEY,
             booking_id INT,
             reason TEXT,
             FOREIGN KEY (booking_id) REFERENCES bookings(id)
         )
     `);

        console.log('Table "cancellations" created or already exists.');

        // Tạo bảng "comments" nếu chưa tồn tại
        await db.execute(`
     CREATE TABLE IF NOT EXISTS comments (
         id INT AUTO_INCREMENT PRIMARY KEY,
         post_id INT,
         user_id INT,
         content TEXT,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
     )
 `);

        // Tạo bảng "categories" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                description TEXT,
                slug VARCHAR(255) UNIQUE NOT NULL,
                image VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
            `);

        console.log('Table "categories" created or already exists.');



    } catch (error) {
        console.error('Error creating tables:', error);
    }
};

createTables();
