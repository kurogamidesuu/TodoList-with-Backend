let todoList = [];
if (localStorage.getItem('todoList')) {
    todoList = JSON.parse(localStorage.getItem('todoList'));
}

document.querySelector('.logout-btn').addEventListener('click', async () => {
    localStorage.clear();
    const res = await fetch('/api/users/logout');
    window.location.href = '/api/login';
});

document.addEventListener('DOMContentLoaded', () => {
    renderList();
});

document.getElementById('js-add-btn').addEventListener('click', async e => {
    e.preventDefault();

    const item = document.querySelector('.js-input-item').value.trim();
    let date = document.querySelector('.js-input-date').value;
    
    const userId = JSON.parse(localStorage.getItem('userId'));

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
    localStorage.setItem('todoList', JSON.stringify(todoList));

    document.querySelector('.js-input-item').value = '';
    renderList();
});

async function deleteTodo(index) {
    const userId = JSON.parse(localStorage.getItem('userId'));

    try {
        const res = await fetch(`/api/users/${userId}/deletetodo?index=${index}`);

        todoList = await res.json();
        localStorage.setItem('todoList', JSON.stringify(todoList));
        renderList();
    } catch(e) {
        console.error("Error occured");
    }
}

async function swapUp(index) {
    const userId = JSON.parse(localStorage.getItem('userId'));
    
    try {
        const res = await fetch(`/api/users/${userId}/swaptodo?index=${index}&direction=up`);

        if (!res.ok) {
            const errData = await res.json();
            alert(errData.error);
        }
        todoList = await res.json();
        localStorage.setItem('todoList', JSON.stringify(todoList));
        renderList();
    } catch(e) {

    }
}

async function swapDown(index) {
    const userId = JSON.parse(localStorage.getItem('userId'));
    
    try {
        const res = await fetch(`/api/users/${userId}/swaptodo?index=${index}&direction=down`);

        if (!res.ok) {
            const errData = await res.json();
            alert(errData.error);
        }
        todoList = await res.json();
        localStorage.setItem('todoList', JSON.stringify(todoList));
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