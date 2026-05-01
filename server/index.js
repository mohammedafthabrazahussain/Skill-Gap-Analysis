const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

// Route files
const auth = require('./routes/auth');
const skills = require('./routes/skills');
const roles = require('./routes/roles');
const analysis = require('./routes/analysis');
const resume = require('./routes/resume');
const tasks = require('./routes/tasks');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/skills', skills);
app.use('/api/v1/roles', roles);
app.use('/api/v1/analysis', analysis);
app.use('/api/v1/resume', resume);
app.use('/api/v1/tasks', tasks);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    });
