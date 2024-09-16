document.getElementById('registerForm').addEventListener('submit', registerUser);
document.getElementById('loginForm').addEventListener('submit', loginUser);
document.getElementById('messageForm').addEventListener('submit', sendMessage);

let token = '';

async function registerUser(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const result = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    }).then(res => res.json());

    alert(result.message);
}

async function loginUser(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const result = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    }).then(res => res.json());

    if (result.token) {
        token = result.token;
        document.getElementById('login').style.display = 'none';
        document.getElementById('messaging').style.display = 'block';
        loadMessages();
    } else {
        alert(result.message);
    }
}

async function sendMessage(event) {
    event.preventDefault();
    const recipient = document.getElementById('recipient').value;
    const messageContent = document.getElementById('messageContent').value;

    const result = await fetch('/message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ recipient, messageContent }),
    }).then(res => res.json());

    alert(result.message);
}

async function loadMessages() {
    const messages = await fetch('/messages', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }).then(res => res.json());

    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messagesDiv.appendChild(messageElement);
    });
}
