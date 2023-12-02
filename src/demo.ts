interface TodoInterface {
  id: number;
  text: string;
  isCompleted?: boolean;
}

class TodoApp {
  private count = 0;
  private todoList: TodoInterface[] = [{ id: 1, text: 'test' }];
  private updatingTodo: undefined | TodoInterface;
  private root = document.querySelector('#root');
  private form = document.querySelector('#todo-form');
  private listDiv = document.querySelector('#todo-list');

  constructor() {
    this.renderList();
  }

  private renderList() {
    const title = this.listDiv?.querySelector('h2');
    const listOl = this.listDiv?.querySelector('ol');
    if (this.todoList.length === 0 && this.listDiv) {
      if (title) title.textContent = 'Nothing here';
      if (listOl) listOl.innerHTML = '';
    } else if (this.todoList.length !== 0 && this.listDiv) {
      if (title) title.textContent = 'todo list:';
      this.todoList.forEach(todo => {
        document.querySelector('#todo-list > ol')?.append(this.renderTodoItem(todo));
      });
    }
  }

  private renderTodoItem(todo: TodoInterface): HTMLElement {
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
