const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

// Connexion to database
mongoose
  .connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017")
  .then(() => console.log("DB Conection Successfull"))
  .catch((error) => {
    console.log(error);
  });

app.use(cors());
app.use(express.json());
// Endpoints
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);
app.use("/api/cart", cartRoute);

// Starting the server
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
