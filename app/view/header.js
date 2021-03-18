import { BaseView } from "../core/view.js";
import { TaskList } from "../model/task.js";

class HeaderView extends BaseView {
  static inject = [...super.inject, 'tasks'];
  static template = /*html*/ `
    <h1>The Naked Task Manager MVC Style</h1>
    <button data-id="addTask">Create new task</button>
  `;

  createView() {
    const dom = super.createView({});
    /** @type {TaskList} */
    const taskList = this.inject.tasks;
    this.findId('addTask').onclick = () => taskList.add();
    return dom;
  }
}

const view = new HeaderView();
document.querySelector("app-header").appendChild(view.createView());
