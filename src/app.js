const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/jobs', require('./routes/jobRoutes'));
app.use('/applications', require('./routes/applicationRoutes'));
app.use('/employer', require('./routes/employerRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
    res.send('Employment System API is running');
});

module.exports = app;
