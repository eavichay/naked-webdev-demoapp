import { DependencyMixin } from '../core/dependency.js';

class AppHeaderView extends HTMLElement {

  static inject = ['tasks'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = /*html*/`
      <style>
        :host {
          display: flex;
          flex-direction: column;
        }
        button {
          background: lime;
          border: none;
          border-radius: 0.25em;
          padding: 1em;
        }
      </style>
      <h1>The Naked Taskmanager</h1>
      <div id="menu">
        <button id="newtask">Create a new task</button>
      </div>
    `;

    this.shadowRoot.querySelector('#newtask').onclick = () => this.inject.tasks.add();
  }
};

customElements.define('app-header', DependencyMixin(AppHeaderView));