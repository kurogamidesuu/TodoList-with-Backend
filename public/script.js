let todoList = localStorage.getItem('todoList') || [];
let currentUsername = null;

document.querySelector('.register-form').addEventListener('submit', async e => {
    e.preventDefault();
    const action = e.submitter.value;
    const username = e.target.username.value.trim();

    try {
        let res;
        if (action === 'register') {
            res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username})
            });
        }

        if (action === 'login') {
            res = await fetch(`/api/login/${username}`);
        }

        if (!res.ok) {
            const errData = await res.json();
            document.querySelector('.exists-msg').innerText = errData.error;
            document.querySelector('.exists-msg').style.display = 'block';

            return console.log(errData.error);
        }

        const data = await res.json();
        
        if(data.userId) {
            localStorage.setItem('userId', data.userId);
            currentUsername = username;

            const todoRes = await fetch(`/api/users/${data.userId}/todos`);
            todoList = await todoRes.json();
            localStorage.setItem('todoList', todoList);
            
            document.querySelector('.register').style.display = 'none';
            document.querySelector('.todo-app').style.display = 'block';
            renderList();
        }

    } catch(e) {
        console.error('error: ', e);
    }
});

document.getElementById('js-add-btn').addEventListener('click', async e => {
    e.preventDefault();

    const item = document.querySelector('.js-input-item').value.trim();
    let date = document.querySelector('.js-input-date').value;
    
    const userId = localStorage.getItem('userId');

    if (!item) {
        alert('Item input required!');
        return 1;
    }

    if (!date) {
        date = new Date().toDateString();
    } else {
        date = new Date(date).toDateString();
    }

    const res = await fetch(`/api/users/${userId}/addtodo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({item, date})
    });

    todoList = await res.json();
    document.querySelector('.js-input-item').value = '';
    renderList();
});

async function deleteTodo(index) {
    const userId = localStorage.getItem('userId');

    try {
        const res = await fetch(`/api/users/${userId}/deletetodo?index=${index}`);

        todoList = await res.json();
        renderList();
    } catch(e) {
        console.error("Error occured");
    }
}

async function swapUp(index) {
    const userId = localStorage.getItem('userId');
    
    try {
        const res = await fetch(`/api/users/${userId}/swaptodo?index=${index}&direction=up`);

        if (!res.ok) {
            const errData = await res.json();
            alert(errData.error);
        }
        todoList = await res.json();
        renderList();
    } catch(e) {

    }
}

async function swapDown(index) {
    const userId = localStorage.getItem('userId');
    
    try {
        const res = await fetch(`/api/users/${userId}/swaptodo?index=${index}&direction=down`);

        if (!res.ok) {
            const errData = await res.json();
            alert(errData.error);
        }
        todoList = await res.json();
        renderList();
    } catch(e) {

    }
}

function renderList() {
    if(!todoList.length) {
        document.querySelector('.js-list').innerHTML = `<div class="empty-list">"Your list is empty! Start adding tasks. 🚀"</div>`;
        return;
    }
    let HTMLstring = '';
    for(let i=0; i<todoList.length; i++) {
        const listObject = todoList[i];
        let {item, date} = listObject;
        date = new Date(date).toDateString();
        HTMLstring += `
        <div class="entry">
            <div>${item}</div>
            <div>${date}</div>
            <div>
                <button onclick="swapUp(${i})" class="swap-btn">▲</button>
                <button onclick="swapDown(${i})" class="swap-btn">▼</button>
            </div>
            <button onclick="deleteTodo(${i})" class="delete-btn">Delete</button>
        </div>    
        `;
    }
    document.querySelector('.js-list').innerHTML = HTMLstring;
}