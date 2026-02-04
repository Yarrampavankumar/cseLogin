const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.urlencoded({ extended: true }));

/* ================== MONGODB CONNECTION ================== */
mongoose.connect("mongodb://localhost:27017/devopscse")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err));

/* ================== UPDATED MONGOOSE MODEL ================== */
const accountSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    userPassword: {
        type: String,
        required: true
    }
});

const Account = mongoose.model("Account", accountSchema,"register");

/* ================== HOME ================== */
app.get("/", (req, res) => {
    res.send(`
        <h2>Welcome</h2>
        <a href="/signup">Register</a><br><br>
        <a href="/signin">Login</a>
    `);
});

/* ================== REGISTER ================== */
app.get("/signup", (req, res) => {
    res.send(`
        <h2>Register</h2>
        <form method="POST" action="/signup">
            <input name="userName" placeholder="Username" required><br><br>
            <input name="userPassword" type="password" placeholder="Password" required><br><br>
            <button>Register</button>
        </form>
    `);
});

app.post("/signup", async (req, res) => {
    const { userName, userPassword } = req.body;

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    await Account.create({
        userName,
        userPassword: hashedPassword
    });

    res.send("Registration successful <br><a href='/signin'>Login</a>");
});

/* ================== LOGIN ================== */
app.get("/signin", (req, res) => {
    res.send(`
        <h2>Login</h2>
        <form method="POST" action="/signin">
            <input name="userName" placeholder="Username" required><br><br>
            <input name="userPassword" type="password" placeholder="Password" required><br><br>
            <button>Login</button>
        </form>
    `);
});

app.post("/signin", async (req, res) => {
    const { userName, userPassword } = req.body;

    const account = await Account.findOne({ userName });
    if (!account) return res.send("Account not found");

    const isMatch = await bcrypt.compare(userPassword, account.userPassword);
    if (!isMatch) return res.send("Incorrect password");

    res.send(`<h2>Login Successful</h2><p>Welcome ${userName}</p>`);
});

/* ================== SERVER ================== */
app.listen(3003, () => {
    console.log("Server running on http://localhost:3002");
});
