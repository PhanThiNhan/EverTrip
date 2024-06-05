const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2'); 
const app = express();
const _CONST = require('./app/config/constant')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

require('./app/models/createTables');

// Thay đổi kết nối cơ sở dữ liệu
const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: 'root',
    database: 'evertrip'
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
    } else {
        console.log('Connected to MySQL.');
    }
});

const authRoute = require('./app/routers/auth');
const userRoute = require('./app/routers/user');
const paymentRoute = require('./app/routers/paypal');
const campgroundRouter = require('./app/routers/campgroundRouter');
const postRoute = require('./app/routers/postRouter');
const serviceRoute = require('./app/routers/serviceRouter');
const voucherRoute = require('./app/routers/voucherRouter');
const bookingRoute = require('./app/routers/bookingRouter');
const cancellationRoute = require('./app/routers/cancellationRouter');
const commentRoute = require('./app/routers/commentRouter');
const statsRouter = require('./app/routers/statsRouter');
const categoryRoute = require('./app/routers/category');

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/campground', campgroundRouter);
app.use('/api/posts', postRoute);
app.use('/api/services', serviceRoute);
app.use('/api/voucher', voucherRoute);
app.use('/api/bookings', bookingRoute);
app.use('/api/cancellations', cancellationRoute);
app.use('/api/comments', commentRoute);
app.use('/api/stats', statsRouter);
app.use('/api/category', categoryRoute);

const PORT = process.env.PORT || _CONST.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
