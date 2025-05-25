const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
// Socket.io
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on('join', (roomName) => {
    socket.join(roomName); // ✅ This avoids doubling 'user_'
    console.log(`✅ User joined room: ${roomName}`);
    console.log('📌 Current rooms:', Array.from(socket.rooms));
  });
  
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
app.set('io', io);
require('dotenv').config();
//middlewares
const errorHandlerMiddleware = require('./middlewares/error-handelr');
const notFound = require('./middlewares/notFound-error')
const authentication = require('./middlewares/authentication')
//routes
const authRouter = require('./routes/auth');
const productsRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');
const dashboardRouter = require('./routes/dashboard');
const productReviewsRouter = require('./routes/productReviews');
const warehouseReviewsRouter = require('./routes/warehouseReviews');
const trackingWarehouseRouter = require('./routes/tracking');
const chargilyRoutes = require('./routes/chargily');
const filteringRouter = require('./routes/filtering');
const adminRouter = require('./routes/admin');
const notificationRouter = require('./routes/notification');

//
app.use(helmet()); // Adds secure headers
app.use(xss()); // Cleans user input
// app.use(rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// }));
app.use(cookieParser());
app.use(cors(
  {
    origin: ["http://localhost:3001", "https://6746-154-121-16-164.ngrok-free.app"],
    credentials: true,
    
  }
));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '10mb'
}));

app.use('/webhook', chargilyRoutes);
app.use(express.json(
  {
    limit: '10mb',
  }
));
//routes
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/auth', authRouter);
app.use('/order', orderRouter);
app.use('/dashboard', dashboardRouter);
//already authenticated
app.use('/productReviews', productReviewsRouter);
app.use('/warehouseReviews', warehouseReviewsRouter);
app.use('/tracking', trackingWarehouseRouter);
app.use('/filtering', filteringRouter);
app.use('/admin', adminRouter);
app.use('/notifications', notificationRouter);

//image access 
app.use('/uploads', express.static('uploads'));
//testing
app.get('/test-socket', (req, res) => {
  const io = req.app.get('io');
  const testData = {
    orderId: 999,
    userId: 123,
    totalAmount: 777,
    createdAt: new Date(),
    message: '🧪 Test Order Notification',
  };
  io.to('user_42').emit('order-received-by-shop', testData);
  console.log('📤 Test order emitted to user_37');
  res.send('Test order emitted!');
});

app.get('/', (req, res) => {
  res.send('Hello World');
  
});
app.get('/about', authentication ,(req, res) => {
  res.json({msg: 'Welcome to the about page'});
})

app.use(notFound);
app.use(errorHandlerMiddleware);
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});