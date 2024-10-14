require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const buildingRoutes = require('./routes/buildingRoutes')
const userRoutes = require('./routes/userRoutes')
const towerRoutes = require('./routes/towerRoutes')
const visitorRequestRoutes = require('./routes/visitorRequestRoutes')
const errorHandler = require('./utils/errorHandler')
const connectDB = require('./config/db')

const app = express();
connectDB()

// Middleware to parse JSON bodies
app.use(express.json());
app.use(morgan('dev'));
app.use(errorHandler);

// Routes
app.use('/api/building', buildingRoutes)
app.use('/api/user', userRoutes)
app.use('/api/tower', towerRoutes)
app.use('/api/visitor', visitorRequestRoutes)

app.get('/api', (req, res) => {
    res.send('Welcome to my API!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});