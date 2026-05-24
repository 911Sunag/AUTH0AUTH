const express = require('express');
const connectDB = require('./config/db.js');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))


app.use('/api/auth', require('./routes/authRoutes.js'))


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is online on port ${PORT}`);
})