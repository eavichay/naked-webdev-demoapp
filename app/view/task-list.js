import { Component } from '../core/component.js';
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

class TaskListView extends Component {
  static inject = ['taskEventBus', 'tasks'];
  static template = template;

  static observedAttributes = ['state'];

  constructor() {
    super();
    this.unsubscribers = [];
    this._render = () => this.render();
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
    this.render();
  }

  get state() {
    return this.getAttribute('state');
  }

  render() {
    if (this.isRendering) {
      requestAnimationFrame(() => {
        this.render();
      });
      return;
    }
    requestAnimationFrame(() => {
      this.isRendering = true;
      const tasks = this.inject.tasks.tasks.filter(task => task.state === this.state);
      this.$.title.textContent = `${this.state} (${tasks.length})`;
      this.$.cards.innerHTML = '';
      const cards = tasks.map(task => {
        const cardElem = document.createElement('task-card');
        cardElem.task = task;
        return cardElem;
      });
      this.$.cards.append(...cards);
      this.isRendering = false;
    });
  }
}

customElements.define('task-list', DependencyMixin(TaskListView));