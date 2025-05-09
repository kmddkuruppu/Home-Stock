const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8070;
const URL = process.env.MONGODB_URL;

if (!URL) {
    console.error("MongoDB URL is not defined in the .env file");
    process.exit(1); // Exit the process if MongoDB URL is not defined
}

console.log("MongoDB URL:", URL); // For debugging

app.use('/uploads', express.static  (path.join(__dirname, 'uploads')));

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(error => {
    console.error("MongoDB Connection Error:", error);
    process.exit(1); // Exit the process if there is an error connecting to MongoDB
});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB connection success");
});

// Call to routes
const budgetRouter = require("./routes/budgets.js");
app.use("/budget", budgetRouter);

const accountRouter = require("./routes/accounts.js");
app.use("/account", accountRouter);

const auth = require("./routes/auth.js");
app.use("/auth", auth);

const contactRouter = require("./routes/contacts.js");
app.use("/contact", contactRouter);

const shoppinglistRouter = require("./routes/shoppinglists.js");
app.use("/shoppinglist", shoppinglistRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});