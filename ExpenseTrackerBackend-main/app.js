const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/Expence2", {
    useNewUrlParser: true,
  })
  .then(() => console.log("DataBase connection successful"))
  .catch((err) => console.log(err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const resetPasswordRoutes = require('./routes/resetpassword');
const premiumFeatureRoutes = require('./routes/premiumFeature');

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/password', resetPasswordRoutes);
app.use('/premium', premiumFeatureRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
