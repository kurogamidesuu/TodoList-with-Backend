let todoList = localStorage.getItem('todoList') || [];

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get('msg');

    if (msg === 'login-required') alert('Please login first.');
    if (msg === 'unauthorized-user') alert('You are not authorized to view this page.');
    if (msg === 'invalid-token') alert('Session expired or token invalid. Please login again.');
});

document.querySelector('.login-form').addEventListener('submit', async e => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();

    try {
        const res = await fetch(`/api/login/${username}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password})
        });

        if (!res.ok) {
            const errData = await res.json();
            document.querySelector('.exists-msg').innerText = errData.error;
            document.querySelector('.exists-msg').style.display = 'block';

            return console.error(errData.error);
        }

        const data = await res.json();
        
        if(data.userId) {
            localStorage.setItem('todoList', JSON.stringify(data.todoList));
            
            window.location.href = `/api/users/${data.username}/todos`;
        }

    } catch(e) {
        console.error('error: ', e);
    }
});