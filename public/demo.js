"use strict";
class TodoApp {
    constructor() {
        var _a, _b, _c, _d;
        this.count = 1;
        this.todoList = [];
        this.form = document.querySelector('#todo-form');
        this.modal = document.querySelector('#modal');
        this.listDiv = document.querySelector('#todo-list');
        this.loadTodoListFromCookie();
        this.renderList();
        (_a = this.form) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', event => {
            var _a;
            event.preventDefault();
            const input = (_a = this.form) === null || _a === void 0 ? void 0 : _a.querySelector('input');
            if (!this.updatingTodo && input) {
                this.todoList.push({ id: ++this.count, text: input.value });
                this.saveTodoListIntoCookie();
                input.value = '';
            }
            if (this.updatingTodo && input) {
                this.updatingTodo.text = input.value;
                this.todoList = this.todoList.map(todo => {
                    var _a;
                    if (this.updatingTodo !== undefined && todo.id === ((_a = this.updatingTodo) === null || _a === void 0 ? void 0 : _a.id))
                        todo = this.updatingTodo;
                    return todo;
                });
                this.saveTodoListIntoCookie();
                this.setUpdatingTodo(undefined);
            }
            this.renderList();
        });
        (_b = this.form) === null || _b === void 0 ? void 0 : _b.addEventListener('reset', () => {
            var _a;
            (_a = this.form) === null || _a === void 0 ? void 0 : _a.reset();
            this.setUpdatingTodo(undefined);
        });
        (_d = (_c = this.modal) === null || _c === void 0 ? void 0 : _c.querySelector('.close-btn')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', event => {
            var _a;
            (_a = this.modal) === null || _a === void 0 ? void 0 : _a.close();
        });
    }
    saveTodoListIntoCookie() {
        document.cookie = `todos=${JSON.stringify(this.todoList)}; expires=${this.getExpirationDate(7)}`;
    }
    loadTodoListFromCookie() {
        const cookie = this.getCookie('todos');
        this.todoList = cookie ? JSON.parse(cookie) : [];
    }
    getCookie(name) {
        const cookies = document.cookie.split(';');
        const listCookie = cookies.find(c => c.trim().startsWith(`${name}`));
        return listCookie ? listCookie.split('=')[1] : null;
    }
    getExpirationDate(days) {
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + days * 24 * 60 * 60 * 1000);
        return expirationDate.toUTCString();
    }
    setUpdatingTodo(todo) {
        this.updatingTodo = todo;
        this.changeFormForUpdate();
    }
    changeFormForUpdate() {
        if (this.form) {
            const title = this.form.querySelector('h2');
            const input = this.form.querySelector('input');
            const submitBtn = this.form.querySelector('button[type=submit]');
            const updatingTodo = this.updatingTodo;
            if (title && updatingTodo && input && submitBtn) {
                title.textContent = `edit "${updatingTodo.text}":`;
                if (updatingTodo === undefined)
                    input.value = '';
                if (updatingTodo !== undefined)
                    input.value = updatingTodo.text;
                submitBtn.textContent = 'edit';
            }
            if (title && !this.updatingTodo && input && submitBtn) {
                title.textContent = `add new todo:`;
                input.value = '';
                submitBtn.textContent = 'add';
            }
        }
    }
    renderList() {
        var _a, _b;
        // console.log(this.todoList);
        const title = (_a = this.listDiv) === null || _a === void 0 ? void 0 : _a.querySelector('h2');
        const listOl = (_b = this.listDiv) === null || _b === void 0 ? void 0 : _b.querySelector('ol');
        if (listOl)
            listOl.innerHTML = '';
        if (this.todoList.length === 0 && this.listDiv) {
            if (title)
                title.textContent = 'Nothing here';
            if (listOl)
                listOl.innerHTML = '';
        }
        else if (this.todoList.length !== 0 && this.listDiv) {
            if (title)
                title.textContent = 'todo list:';
            this.todoList.forEach(todo => {
                var _a;
                (_a = document.querySelector('#todo-list > ol')) === null || _a === void 0 ? void 0 : _a.append(this.renderTodoItem(todo));
            });
        }
    }
    renderTodoItem(todo) {
        const todoDiv = document.createElement('li');
        todoDiv.className = 'todo-item';
        const text = document.createElement('p');
        text.textContent = todo.text;
        const editBtn = document.createElement('button');
        const removeBtn = document.createElement('button');
        editBtn.type = removeBtn.type = 'button';
        editBtn.textContent = 'edit';
        removeBtn.textContent = 'remove';
        text.addEventListener('click', event => {
            const _self = event.currentTarget;
            if (_self) {
                if (todo.isCompleted) {
                    _self.classList.remove('completed');
                    todo.isCompleted = false;
                }
                else {
                    _self.classList.add('completed');
                    todo.isCompleted = true;
                }
            }
        });
        editBtn.addEventListener('click', event => {
            this.setUpdatingTodo(todo);
        });
        removeBtn.addEventListener('click', event => {
            var _a;
            this.renderVerifyRemoveModal(todo);
            (_a = this.modal) === null || _a === void 0 ? void 0 : _a.showModal();
        });
        todoDiv.append(text, editBtn, removeBtn);
        return todoDiv;
    }
    renderVerifyRemoveModal(todo) {
        var _a, _b, _c;
        const title = (_a = this.modal) === null || _a === void 0 ? void 0 : _a.querySelector('.title');
        if (title)
            title.textContent = `Remove "${todo.text}"`;
        const main = (_b = this.modal) === null || _b === void 0 ? void 0 : _b.querySelector('main');
        if (main) {
            main.innerHTML = '';
            const message = document.createElement('p');
            message.textContent = `Are you sure want to remove "${todo.text}" ?`;
            main.append(message);
        }
        const footer = (_c = this.modal) === null || _c === void 0 ? void 0 : _c.querySelector('footer');
        if (footer) {
            footer.innerHTML = '';
            const submitBtn = document.createElement('button');
            const cancelBtn = document.createElement('button');
            submitBtn.textContent = 'Accept';
            cancelBtn.textContent = 'Cancel';
            submitBtn.addEventListener('click', () => {
                var _a;
                this.todoList = this.todoList.filter(el => el.id !== todo.id);
                this.saveTodoListIntoCookie();
                this.renderList();
                (_a = this.modal) === null || _a === void 0 ? void 0 : _a.close();
            });
            cancelBtn.addEventListener('click', () => {
                var _a;
                (_a = this.modal) === null || _a === void 0 ? void 0 : _a.close();
            });
            footer.append(cancelBtn, submitBtn);
        }
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const app = new TodoApp();
});
