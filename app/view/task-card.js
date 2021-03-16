import { DependencyMixin } from '../core/dependency.js';
import { Component } from '../core/component.js';

const template = /*html*/`
<style>
  :host {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    border: 1px solid black;
    border-radius: 0.25em;
    font-size: 1em;
    padding: 0.25em;
    box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.15);
  }
  :host([state="todo"]) #todo,
  :host([state="in-progress"]) #in-progress,
  :host([state="done"]) #done {
    display: none;
  }
  input, textarea {
    border: none;
  }

  input {
    font-size: 1.2em;
    font-weight: bold;
  }

  #taskId {
    position: absolute;
    top: 0;
    right: 0;
  }

  button {
    background: lime;
    border: none;
    border-radius: 0.25em;
    padding: 0.25em;
  }

  button:not(:last-child) {
    margin-bottom: 0.25em;
  }

  #delete {
    background: darkred;
    color: white;
  }
</style>
<input placeholder="Untitled Task" id="title">
<textarea id="description" placeholder="No Description" rows="8"></textarea>
<button id="todo" data-action="state">Todo</button>
<button id="in-progress" data-action="state">In-Progress</button>
<button id="done" data-action="state">Done</button>
<hr/>
<button id="delete" data-action="delete">DELETE</button>
<span id="taskId"><span>
`;

class TaskView extends Component {

  static inject = ["tasks"];
  static template = template;

  constructor() {
    super();
    this.shadowRoot.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', (e) => {
        if (button.dataset.action === 'state') {
          const nextState = e.target.id;
          this.task.state = nextState;
        }
      });
    });
    this.$.description.addEventListener('change', () => {
      this.task.description = this.$.description.value;
    });
    this.$.title.onchange = () => {
      this.task.title = this.$.title.value;
    };
    this.$.delete.onclick = () => {
      this.inject.tasks.remove(this.task);
    };
  }

  get task() {
    return this._task;
  }

  set task(v) {
    this._task = v;
    this.setAttribute('state', v.state)
    this.update();
  }

  render() {
    this.shadowRoot.innerHTML = template;
  }
  
  update() {
    this.$.title.value = this.task.title;
    this.$.description.value = this.task.description;
    this.$.taskId.textContent = this.task.taskId;
  }
}

customElements.define('task-card', DependencyMixin(TaskView));