type TodoType = {
  id: number;
  text: string;
  isCompleted?: boolean;
};

class TodoApp {
  private count = 1;
  private todoList: TodoType[] = [{ id: 1, text: 'test' }];
  private updatingTodo: undefined | TodoType;
  private form: HTMLFormElement | null = document.querySelector('#todo-form');
  private modal: HTMLDialogElement | null = document.querySelector('#modal');
  private listDiv = document.querySelector('#todo-list');

  constructor() {
    this.renderList();
    this.form?.addEventListener('submit', event => {
      event.preventDefault();
      const input = this.form?.querySelector('input');

      if (!this.updatingTodo && input) {
        this.todoList.push({ id: ++this.count, text: input.value });
        input.value = '';
      }
      if (this.updatingTodo && input) {
        this.updatingTodo.text = input.value;
        this.todoList = this.todoList.map(todo => {
          if (this.updatingTodo !== undefined && todo.id === this.updatingTodo?.id) todo = this.updatingTodo;
          return todo;
        });
        this.setUpdatingTodo(undefined);
      }
      this.renderList();
    });
    this.form?.addEventListener('reset', event => {
      this.form?.reset();
      this.setUpdatingTodo(undefined);
    });
    this.modal?.querySelector('.close-btn')?.addEventListener('click', event => {
      this.modal?.close();
    });
  }

  setUpdatingTodo(todo: undefined | TodoType) {
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
        if (updatingTodo === undefined) input.value = '';
        if (updatingTodo !== undefined) input.value = updatingTodo.text;
        submitBtn.textContent = 'edit';
      }
      if (title && !this.updatingTodo && input && submitBtn) {
        title.textContent = `add new todo:`;
        input.value = '';
        submitBtn.textContent = 'add';
      }
    }
  }

  private renderList() {
    // console.log(this.todoList);
    const title = this.listDiv?.querySelector('h2');
    const listOl = this.listDiv?.querySelector('ol');
    if (listOl) listOl.innerHTML = '';
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

  private renderTodoItem(todo: TodoType): HTMLElement {
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
      const _self = event.currentTarget as HTMLElement;
      if (_self) {
        if (todo.isCompleted) {
          _self.classList.remove('completed');
          todo.isCompleted = false;
        } else {
          _self.classList.add('completed');
          todo.isCompleted = true;
        }
      }
    });

    editBtn.addEventListener('click', event => {
      this.setUpdatingTodo(todo);
    });

    removeBtn.addEventListener('click', event => {
      this.renderVerifyRemoveModal(todo);
      this.modal?.showModal();
    });

    todoDiv.append(text, editBtn, removeBtn);

    return todoDiv;
  }

  private renderVerifyRemoveModal(todo: TodoType) {
    const title = this.modal?.querySelector('.title');
    if (title) title.textContent = `Remove "${todo.text}"`;

    const main = this.modal?.querySelector('main');
    if (main) {
      main.innerHTML = '';
      const message = document.createElement('p');
      message.textContent = `Are you sure want to remove "${todo.text}" ?`;
      main.append(message);
    }

    const footer = this.modal?.querySelector('footer');
    if (footer) {
      footer.innerHTML = '';
      const submitBtn = document.createElement('button');
      const cancelBtn = document.createElement('button');
      submitBtn.textContent = 'Accept';
      cancelBtn.textContent = 'Cancel';

      submitBtn.addEventListener('click', () => {
        this.todoList = this.todoList.filter(el => el.id !== todo.id);
        this.renderList();
        this.modal?.close();
      });

      cancelBtn.addEventListener('click', () => {
        this.modal?.close();
      });
      footer.append(cancelBtn, submitBtn);
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const app = new TodoApp();
});
