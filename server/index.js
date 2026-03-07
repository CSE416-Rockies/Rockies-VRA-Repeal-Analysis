const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

const uri = `mongodb+srv://admin:${process.env.ADMIN_PASSWORD}@vra-repeal-analysis.ncptw12.mongodb.net/vra_database?retryWrites=true&w=majority`;

// Connect to MongoDB Atlas
mongoose.connect(uri)
  .then(() => {
    console.log("Mongoose connected to Atlas");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("Database connection error:", err));