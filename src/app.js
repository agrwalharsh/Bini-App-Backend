require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const http = require('http');
const WebSocket = require('ws');
const { initWebSocketServer } = require('./ws/websocketService');
const buildingRoutes = require('./routes/buildingRoutes')
const userRoutes = require('./routes/userRoutes')
const towerRoutes = require('./routes/towerRoutes')
const visitorRequestRoutes = require('./routes/visitorRequestRoutes')
const errorHandler = require('./utils/errorHandler')
const connectDB = require('./config/db')
const CONSTANTS = require('./utils/constants')

const app = express();
const server = http.createServer(app);
initWebSocketServer(server);
connectDB()

// Middleware to parse JSON bodies
app.use(express.json());
app.use(morgan('dev'));
app.use(errorHandler);

// Routes
app.use('/building', buildingRoutes)
app.use('/user', userRoutes)
app.use('/tower', towerRoutes)
app.use('/visitor', visitorRequestRoutes)

app.get('/', (req, res) => {
    res.send('Welcome to my API!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});