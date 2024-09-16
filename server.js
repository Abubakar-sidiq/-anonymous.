const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const SECRET_KEY = 'your_secret_key';

let users = [];
let messages = [];

app.use(bodyParser.json());

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.json({ message: 'User registered successfully' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username: user.username }, SECRET_KEY);
        res.json({ token });
    } else {
        res.json({ message: 'Invalid credentials' });
    }
});

app.post('/message', authenticateToken, (req, res) => {
    const { recipient, messageContent } = req.body;
    const recipientExists = users.find(u => u.username === recipient);
    
    if (!recipientExists) {
        return res.json({ message: 'Recipient not found' });
    }

    messages.push({ recipient, content: messageContent });
    res.json({ message: 'Message sent successfully' });
});

app.get('/messages', authenticateToken, (req, res) => {
    const userMessages = messages.filter(m => m.recipient === req.user.username);
    res.json(userMessages.map(m => m.content));
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
