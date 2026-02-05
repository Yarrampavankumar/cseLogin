const express = require("express");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.urlencoded({ extended: true }));

const accounts = [];

const style = `
    <style>
        body {
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(120deg, #667eea, #764ba2);
            font-family: Arial, sans-serif;
        }
        .card {
            background: white;
            padding: 30px;
            width: 320px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            text-align: center;
        }
        h2 {
            margin-bottom: 20px;
        }
        input {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            border: 1px solid #ccc;
        }
        button {
            width: 100%;
            padding: 10px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background: #5a67d8;
        }
        a {
            display: block;
            margin-top: 15px;
            text-decoration: none;
            color: #667eea;
        }
        .error {
            color: red;
        }
        .success {
            color: green;
        }
    </style>
`;

app.get("/", (req, res) => {
    res.send(`
        ${style}
        <div class="card">
            <h2>Welcome</h2>
            <a href="/signup">Create Account</a>
            <a href="/signin">Login</a>
        </div>
    `);
});

app.get("/signup", (req, res) => {
    res.send(`
        ${style}
        <div class="card">
            <h2>Register</h2>
            <form method="POST" action="/signup">
                <input name="userName" placeholder="Username" required>
                <input type="password" name="userPassword" placeholder="Password" required>
                <button>Register</button>
            </form>
            <a href="/signin">Already have an account?</a>
        </div>
    `);
});

app.post("/signup", async (req, res) => {
    const { userName, userPassword } = req.body;

    const existingUser = accounts.find(acc => acc.userName === userName);
    if (existingUser) {
        return res.send(`
            ${style}
            <div class="card">
                <p class="error">User already exists</p>
                <a href="/signup">Try Again</a>
            </div>
        `);
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);
    accounts.push({ userName, userPassword: hashedPassword });

    res.send(`
        ${style}
        <div class="card">
            <p class="success">Registration successful</p>
            <a href="/signin">Login Now</a>
        </div>
    `);
});

app.get("/signin", (req, res) => {
    res.send(`
        ${style}
        <div class="card">
            <h2>Login</h2>
            <form method="POST" action="/signin">
                <input name="userName" placeholder="Username" required>
                <input type="password" name="userPassword" placeholder="Password" required>
                <button>Login</button>
            </form>
            <a href="/signup">Create new account</a>
        </div>
    `);
});

app.post("/signin", async (req, res) => {
    const { userName, userPassword } = req.body;

    const account = accounts.find(acc => acc.userName === userName);
    if (!account) {
        return res.send(`
            ${style}
            <div class="card">
                <p class="error">Account not found</p>
                <a href="/signin">Try Again</a>
            </div>
        `);
    }

    const isMatch = await bcrypt.compare(userPassword, account.userPassword);
    if (!isMatch) {
        return res.send(`
            ${style}
            <div class="card">
                <p class="error">Incorrect password</p>
                <a href="/signin">Try Again</a>
            </div>
        `);
    }

    res.send(`
        ${style}
        <div class="card">
            <h2>Login Successful</h2>
            <p>Welcome, <b>${userName}</b></p>
        </div>
    `);
});

app.listen(3004, () => {
    console.log("Server running at http://localhost:3004");
});
