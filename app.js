require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConfig');
const cookieParser = require('cookie-parser');

const rootRoutes = require('./routes/rootRoutes');
const registerRoutes = require('./routes/registerRoutes');
const authRoutes = require('./routes/authRoutes');
const refreshRoutes = require('./routes/refreshRoutes');
const verifyJWT = require('./middlewares/verifyJWT');

const app = express();

// Connect to database
connectDB();
mongoose.connection.once('open', () => {
    app.listen(3000);
});

// Middleware for json
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// serve static files
app.use(express.static('public'));

// Routes
app.use(rootRoutes);
app.use(registerRoutes);
app.use(authRoutes);
app.use(refreshRoutes);

app.use(verifyJWT);
app.get('/test', (req, res) => {res.status(200).json('OK')});

