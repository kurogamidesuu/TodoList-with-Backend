let todoList = localStorage.getItem('todoList') || [];

document.querySelector('.register-form').addEventListener('submit', async e => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    const name = e.target.name.value.trim();
    const password = e.target.password.value.trim();

    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, name, password})
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