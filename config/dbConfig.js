const mongoose = require('mongoose');

// database connection
const connectDB = async () => {
    const dbURI = 'mongodb+srv://KhoiMai:Meobaymau@cluster0.0asjcnn.mongodb.net/template-sever';
    mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((result) => console.log('connect successfully'))
        .catch((err) => console.log(err.message));
}

module.exports = connectDB;