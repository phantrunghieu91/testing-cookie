"use strict";
class TodoApp {
    constructor() {
        this.count = 0;
        this.todoList = [{ id: 1, text: 'test' }];
        this.root = document.querySelector('#root');
        this.form = document.querySelector('#todo-form');
        this.listDiv = document.querySelector('#todo-list');
        this.renderList();
    }
    renderList() {
        var _a, _b;
        const title = (_a = this.listDiv) === null || _a === void 0 ? void 0 : _a.querySelector('h2');
        const listOl = (_b = this.listDiv) === null || _b === void 0 ? void 0 : _b.querySelector('ol');
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
        removeBtn.addEventListener('click', event => {
            this.todoList = this.todoList.filter(el => el.id !== todo.id);
            this.renderList();
        });
        todoDiv.append(text, editBtn, removeBtn);
        return todoDiv;
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const app = new TodoApp();
});
