const express = require('express')
const cors = require('cors')
require('dotenv').config()
const db = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const farmRoutes = require('./routes/farmRoutes')
const cropRoutes = require('./routes/cropRoutes')
const expenseRoute = require('./routes/expenseRoute')
const incomeRoute = require('./routes/incomeRoute');
const analysisRoute = require('./routes/analysisRoutes');
const budgetRoute = require('./routes/budgetRoutes')
const dashboardRoute = require('./routes/dashboardRoute')
const reportRoute = require('./routes/reportRoute')
const aiRoute = require('./routes/aiRoute')


const app = express()

app.use(cors());
app.use(express.json())

app.use("/api/auth", authRoutes);
app.use('/api/farm', farmRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/expenses', expenseRoute)
app.use('/api/income', incomeRoute);
app.use('/api/analysis', analysisRoute)
app.use('/api/budget', budgetRoute)
app.use('/api/dashboard', dashboardRoute)
app.use('/api/reports', reportRoute)
app.use('/api/ai', aiRoute)

app.get(
    '/',
    (req, res) => {
        res.json('AgriTrack backend is running')
    }
);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})