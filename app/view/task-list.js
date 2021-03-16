import { DependencyMixin } from '../core/dependency.js';
import { TASK_EVENTS } from '../events.js';

const template = /*html*/`
<style>
  :host {
    display: inline-flex;
    flex-direction: column;
    flex: 33%;
    padding: 1em;
    align-self: stretch;
  }
  #cards {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  #title, #summary {
    height: 2em;
  }
  
  #title {
    text-transform: capitalize;
  }

  task-card:not(:first-child) {
    margin-top: 1em;
  }
</style>
<div id="title"></div>
<div id="cards"></div>
<div id="summary"></div>
`

class TaskListView extends HTMLElement {
  static inject = ['taskEventBus', 'tasks'];

  static observedAttributes = ['state'];

  constructor() {
    super();
    this.unsubscribers = [];
    this.attachShadow({ mode: 'open' });
    this._render = this._render.bind(this);
  }

  connectedCallback() {
    this.unsubscribers.forEach(unsub => unsub());
    this.inject.taskEventBus.on(TASK_EVENTS.TASK_ADDED, this._render);
    this.inject.taskEventBus.on(TASK_EVENTS.TASK_REMOVED, this._render);
    this.inject.taskEventBus.on(TASK_EVENTS.TASK_UPDATED, this._render);
  }

  disconnectedCallback() {
    this.unsubscribers.forEach(unsub => unsub());
  }

  attributeChangedCallback() {
    this._render();
  }

  get state() {
    return this.getAttribute('state');
  }

  _render() {
    if (this.isRendering) {
      requestAnimationFrame(() => {
        this._render();
      });
      return;
    }
    requestAnimationFrame(() => {
      this.isRendering = true;
      this._doRender();
      this.isRendering = false;
    });
  }

  _doRender() {
    const tasks = this.inject.tasks.tasks.filter(task => task.state === this.state);
    this.shadowRoot.innerHTML = template;
    this.shadowRoot.querySelector('#title').textContent = `${this.state} (${tasks.length})`;
    const container = this.shadowRoot.querySelector('#cards');
    const cards = tasks.map(task => {
      const cardElem = document.createElement('task-card');
      cardElem.task = task;
      return cardElem;
    });
    container.append(...cards);
  }
}

customElements.define('task-list', DependencyMixin(TaskListView));