require('dotenv').config()
const express = require("express");
const { connectDB } = require('./config/mysql/sequelize');
const cors = require("cors");
const userRoutes = require("./routes/authRoutes/user");
const seekerRoutes = require("./routes/authRoutes/jobSeeker")
const employerRoutes = require("./routes/authRoutes/employee")
const adminRoutes = require('./routes/adminRoutes/admin')
const app = express();
const PORT = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use("/api/user", userRoutes);
app.use("/api/seeker", seekerRoutes);
app.use("/api/employer", employerRoutes);
app.use("/api/admin",adminRoutes)
app.get("/", (req, res) => {
  res.send("Server is up!");
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});