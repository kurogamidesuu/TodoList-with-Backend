let todoList = localStorage.getItem('todoList') || [];

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
            localStorage.setItem('userId', JSON.stringify(data.userId));

            todoList = data.todoList;
            localStorage.setItem('todoList', JSON.stringify(todoList));
            
            window.location.href = '/api/users/todos';
        }

    } catch(e) {
        console.error('error: ', e);
    }
});