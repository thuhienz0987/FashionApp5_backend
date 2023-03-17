require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConfig');
const cookieParser = require('cookie-parser');
const credentials = require('./middlewares/credentials');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
require('express-async-errors');

const rootRoutes = require('./routes/index');
const registerRoutes = require('./routes/registerRoutes');
const authRoutes = require('./routes/authRoutes');
const refreshRoutes = require('./routes/refreshRoutes');
const productRouters = require('./routes/productRouters');
const verifyJWT = require('./middlewares/verifyJWT');

const app = express();

// Connect to database
connectDB();
mongoose.connection.once('open', () => {
    app.listen(3000);
});

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// Middleware for json
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// serve static files
app.use(express.static('public'));

// Routes
app.use(rootRoutes);
// app.use(registerRoutes);
// app.use(authRoutes);
// app.use(refreshRoutes);
// app.use(productRouters);
// app.use(verifyJWT);
app.get('/test', (req, res) => {res.status(200).json('OK')});

