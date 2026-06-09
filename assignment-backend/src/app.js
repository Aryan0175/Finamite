const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
    res.status(200).json({ message: 'API is working!' });
});
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
});

module.exports = app;