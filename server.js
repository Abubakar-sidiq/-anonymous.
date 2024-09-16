const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost/anonymousMessages', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Failed to connect to MongoDB', err));

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});
const User = mongoose.model('User', userSchema);

// Message Schema
const messageSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    dateSent: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// Register User
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).send('User registered');
});

// Login User
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).send('User not found');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: user._id }, 'yourSecretKey');
    res.json({ token });
});

// Middleware for Authentication
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access denied');

    try {
        const verified = jwt.verify(token, 'yourSecretKey');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};

// Send Anonymous Message
app.post('/send-message', authenticate, async (req, res) => {
    const { recipientUsername, content } = req.body;

    const recipient = await User.findOne({ username: recipientUsername });
    if (!recipient) return res.status(404).send('Recipient not found');

    const newMessage = new Message({
        recipient: recipient._id,
        content,
    });
    await newMessage.save();
    res.status(201).send('Message sent');
});

// View Messages for Logged-in User
app.get('/my-messages', authenticate, async (req, res) => {
    const messages = await Message.find({ recipient: req.user.id }).sort({ dateSent: -1 });
    res.json(messages);
});

// Start Server
app.listen(5000, () => console.log('Server running on port 5000'));

