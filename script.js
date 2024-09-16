// Switch between login and register form
function showRegister() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('register').style.display = 'block';
}

function showLogin() {
    document.getElementById('register').style.display = 'none';
    document.getElementById('login').style.display = 'block';
}

// Handle form submission
document.getElementById('registerForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    alert(`Registered successfully! Username: ${username}`);
    showLogin();
});

document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    alert(`Logged in successfully! Username: ${username}`);
    document.getElementById('login').style.display = 'none';
    document.getElementById('message').style.display = 'block';
});

document.getElementById('messageForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const messageContent = document.getElementById('messageContent').value;
    alert(`Message sent: ${messageContent}`);
});
